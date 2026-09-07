import test from 'node:test'
import assert from 'node:assert/strict'
import { catalog, toggleNode, nodeIncludesChildren, scopeNodes, actionState, allowedFact, depth, descendants, effectiveButton, emptyRole, grantErrors, initialTopology, moveOrg, pageAllowed, parseTopology, recipients, scope, sources, validRanges, type Assignment } from '../src/components/permissions/topology-model.ts'

function fixture() {
  const s = initialTopology()
  const a = s.appointments.find(a => a.org === 'grp-cs')!
  const grant = (id: string, role: string, nodes: string[] = [], appointments: string[] = [], descendants = false): Assignment => ({ id, role, nodes, appointments, descendants, read: null, write: null })
  return { s, a, grant }
}
test('node and descendants are dynamic; same-level concrete selection is not', () => {
  const { s, grant } = fixture()
  const tree = grant('tree','viewer',['department'],[],true)
  const sameLevel = grant('level','viewer',s.orgs.filter(o => depth(s.orgs,o.id) === 2).map(o => o.id))
  s.orgs.push({ id:'future',parent:'department',name:'未来组' })
  s.appointments.push({ id:'future-a',org:'future',person:s.people[0].id,title:'成员',active:true })
  assert(recipients(s,tree).some(a => a.id === 'future-a'))
  assert(!recipients(s,sameLevel).some(a => a.id === 'future-a'))
  assert(recipients(s,grant('root','viewer',['department'])).every(a => a.org === 'department'))
})
test('direct assignment addresses appointment, not every card for the same person', () => {
  const { s, grant } = fixture()
  const cards = s.appointments.filter(a => a.person === 'person-zhou-lin')
  s.assignments = [grant('g','manager',[],[cards[0].id])]
  assert.equal(sources(s,'person-zhou-lin',cards[0].id).length,1)
  assert.equal(sources(s,'person-zhou-lin',cards[1].id).length,0)
  cards[0].active = false
  assert.equal(sources(s,'person-zhou-lin').length,0)
})
test('ancestor grant uses recipient appointment organization as data anchor', () => {
  const { s, a, grant } = fixture()
  s.assignments = [grant('g','manager',['department'],[],true)]
  assert(allowedFact(s,a.person,'leads','edit',s.facts.find(f => f.org === a.org)!))
  assert(!allowedFact(s,a.person,'leads','edit',s.facts.find(f => f.org === 'grp-op5')!))
})
test('read-only cross-org access cannot borrow edit from another grant', () => {
  const { s, a, grant } = fixture()
  const cross = grant('cross','viewer',[],[a.id]); cross.read = { mode:'custom',nodes:['grp-op5'],descendants:false }
  s.assignments = [grant('edit','manager',[],[a.id]),cross]
  const other = s.facts.find(f => f.org === 'grp-op5')!
  assert(allowedFact(s,a.person,'leads','read',other))
  assert(!allowedFact(s,a.person,'leads','edit',other))
  assert.equal(a.org,'grp-cs')
})
test('one role may provide page access while another provides paired action and scope', () => {
  const { s, a, grant } = fixture()
  const page = emptyRole('page','仅页面'); page.pages.leads = { access:true,full:false,buttons:{} }
  const edit = emptyRole('edit','仅动作'); edit.pages.leads = { access:false,full:false,buttons:{ edit:'enabled' } }; edit.read = scope('org'); edit.write = scope('org')
  s.roles = [page,edit]; s.assignments = [grant('p','page',[],[a.id]),grant('e','edit',[],[a.id])]
  assert(allowedFact(s,a.person,'leads','edit',s.facts.find(f => f.org === a.org)!))
  s.assignments.shift(); assert(!pageAllowed(s,a.person,'leads'))
})
test('full page is future-proof, exceptions only restrict one role, three states union', () => {
  const { s, a, grant } = fixture()
  const manager = s.roles.find(r => r.id === 'manager')!
  assert.equal(actionState(manager,'leads','future'),'enabled')
  assert.equal(actionState(manager,'leads','delete'),'hidden')
  s.assignments = [grant('m','manager',[],[a.id])]
  const extra = emptyRole('extra','删除'); extra.pages.leads = { access:false,full:false,buttons:{ delete:'disabled' } }; extra.read = scope('org'); extra.write = scope('org'); s.roles.push(extra); s.assignments.push(grant('extra','extra',[],[a.id]))
  assert.equal(effectiveButton(s,a.person,'leads','delete'),'disabled')
  extra.pages.leads.buttons.delete = 'enabled'
  assert.equal(effectiveButton(s,a.person,'leads','delete'),'enabled')
  assert(allowedFact(s,a.person,'leads','delete',s.facts.find(f => f.org === a.org)!))
})
test('write subset validates empty organizations and ownership rather than sample fact coverage', () => {
  const { s, a } = fixture(); s.orgs.push({ id:'empty',name:'空组',parent:'department' })
  assert(!validRanges(s,scope('self'),scope('org'),a))
  assert(!validRanges(s,scope('org'),scope('all'),a))
  assert(validRanges(s,scope('all'),scope('org'),a))
  assert(!validRanges(s,scope('org'),{ mode:'custom',nodes:['empty'],descendants:false },a))
})
test('moving a node keeps direct grants and changes inherited sources without moving facts', () => {
  const { s, a, grant } = fixture(); s.assignments = [grant('old','viewer',['department']),grant('new','viewer',['grp-op5'],[],true),grant('direct','manager',['grp-cs'])]
  const next = moveOrg(s,'grp-cs','grp-op5')
  assert.equal(depth(next.orgs,'grp-cs'),3)
  assert.deepEqual(sources(next,a.person,a.id).map(x => x.grant.id).sort(),['direct','new'])
  assert.deepEqual(next.facts,s.facts)
  assert.throws(() => moveOrg(next,'grp-op5','grp-cs'))
  assert.throws(() => moveOrg(next,'department','grp-cs'))
})
test('ending then rejoining uses new appointment, never resurrects direct grants', () => {
  const { s, a, grant } = fixture(); s.assignments = [grant('g','manager',[],[a.id])]; a.active = false
  s.appointments.push({ ...a,id:'rejoin',active:true })
  assert.equal(sources(s,a.person).length,0)
})
test('HRM role changes keep assignments; admission and account disable block existing grants', () => {
  const { s, a, grant } = fixture(); s.assignments = [grant('g','manager',[],[a.id])]
  const p = s.people.find(p => p.id === a.person)!
  p.hrmRole = '其他'; assert(pageAllowed(s,p.id,'leads'))
  p.admitted = false; assert(!pageAllowed(s,p.id,'leads')); assert.equal(effectiveButton(s,p.id,'leads','edit'),'hidden')
  p.admitted = true; p.enabled = false; assert(!pageAllowed(s,p.id,'leads'))
})
test('revoking one source leaves other sources and role edits apply without relogin', () => {
  const { s, a, grant } = fixture(); s.assignments = [grant('one','manager',[],[a.id]),grant('two','manager',['grp-cs'])]
  s.assignments.shift(); assert(pageAllowed(s,a.person,'leads'))
  s.roles.find(r => r.id === 'manager')!.pages.leads.access = false
  assert(!pageAllowed(s,a.person,'leads'))
})
test('own records use business owner, not membership or creation', () => {
  const { s, a, grant } = fixture(); s.assignments = [grant('g','member',[],[a.id])]
  const f = { ...s.facts[0],org:'grp-op5',owner:a.person }
  assert(allowedFact(s,a.person,'leads','edit',f))
  assert(!allowedFact(s,a.person,'leads','edit',{ ...f,owner:'other' }))
})
test('overlapping ancestor and direct recipients deduplicate appointments and people', () => {
  const { s, a, grant } = fixture(); const g = grant('g','viewer',['department',a.org],[a.id],true)
  const result = recipients(s,g)
  assert.equal(result.length,new Set(result.map(a => a.id)).size)
  assert(new Set(result.map(a => a.person)).size < result.length)
})
test('grant validation and cache reject invalid policies and cyclic trees', () => {
  const { s, a, grant } = fixture(); const g = grant('g','member',[],[a.id]); g.write = scope('all')
  assert(grantErrors(s,g).length)
  assert(parseTopology(JSON.stringify(s)))
  assert.equal(parseTopology('{oops'),null)
  const cycle = structuredClone(s); cycle.orgs[0].parent = cycle.orgs[1].id
  assert.equal(parseTopology(JSON.stringify(cycle)),null)
  assert.equal(parseTopology(JSON.stringify({ ...s,roles:[{ id:'bad',name:'bad' }] })),null)
  assert(descendants(s.orgs,'department').length > 1)
})
test('admin automatically includes future pages and actions', () => {
  const { s } = fixture()
  assert(pageAllowed(s,'admin','future-page'))
  assert.equal(effectiveButton(s,'admin','future-page','future-action'),'enabled')
  s.people.find(p => p.id === 'admin')!.admitted = false
  assert(!pageAllowed(s,'admin','future-page'))
})


test('per-node checkboxes switch mode without changing other nodes and toggle off immediately', () => {
  const { s, grant } = fixture()
  let g = toggleNode(grant('g','viewer'),'department',false)
  assert.equal(recipients(s,g).length,2)
  g = toggleNode(g,'department',true)
  assert.equal(recipients(s,g).length,23)
  g = toggleNode(g,'department',true)
  assert.equal(recipients(s,g).length,0)
  g = toggleNode(toggleNode(g,'grp-cs',false),'grp-op5',true)
  s.orgs.push({ id:'child',name:'新下级',parent:'grp-op5' })
  s.appointments.push({ id:'child-a',person:'person-tian-jing',org:'child',title:'成员',active:true })
  assert(recipients(s,g).some(a => a.id === 'child-a'))
  assert(!nodeIncludesChildren(g,'grp-cs'))
  assert(nodeIncludesChildren(g,'grp-op5'))
  s.assignments.push(g)
  assert(parseTopology(JSON.stringify(s)))
})
test('data scopes preserve mixed subtree and node-only choices', () => {
  const { s,a } = fixture()
  s.orgs.push({ id:'cs-child',name:'客服下级',parent:'grp-cs' },{ id:'op-child',name:'运营下级',parent:'grp-op5' })
  const value = toggleNode(toggleNode(scope('custom'),'grp-cs',false),'grp-op5',true)
  assert.deepEqual(scopeNodes(s,value,a).sort(),['grp-cs','grp-op5','op-child'])
})
test('editing a legacy subtree grant preserves unrelated subtree selections', () => {
  const { grant } = fixture()
  const next = toggleNode(grant('g','viewer',['grp-cs','grp-op5'],[],true),'grp-cs',false)
  assert(!nodeIncludesChildren(next,'grp-cs'))
  assert(nodeIncludesChildren(next,'grp-op5'))
})


test('organization creation and appointment controls have independent grants', () => {
  const role = emptyRole('onsite', '页面点选')
  role.pages.organization = { access: true, full: false, buttons: { create: 'disabled', appoint: 'enabled' } }
  assert.equal(actionState(role, 'organization', 'create'), 'disabled')
  assert.equal(actionState(role, 'organization', 'appoint'), 'enabled')
  assert.equal(actionState(role, 'organization', 'edit'), 'hidden')
})


test('cross-page catalog keeps registered actions and role drafts round-trip', () => {
  const s = initialTopology()
  assert.equal(catalog.find(p => p.id === 'portal')?.href, '/')
  assert(catalog.find(p => p.id === 'portal')?.actions.some(a => a.id === 'portal.enter'))
  const role = s.roles[0]
  role.pages.portal = {access:true, full:false, buttons:{'portal.enter':'disabled'}}
  const restored = parseTopology(JSON.stringify(s))!
  assert.equal(actionState(restored.roles[0],'portal','portal.enter'), 'disabled')
  assert.equal(restored.roles[0].pages.portal.access, true)
  assert.equal(catalog.filter(p=>p.href==='/organization/figma').length, 1)
})
