import assert from 'node:assert/strict'
import test, { after } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

// 使用项目已有 Vite 编译真实 TSX；不增加 DOM 模拟器或测试运行依赖。
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
after(() => server.close())
const { PrerequisiteAction } = await server.ssrLoadModule('/src/components/ui/form-controls.tsx')
const { DateRangePicker } = await server.ssrLoadModule('/src/components/ui/date-range-picker.tsx')

test('前置条件由显式列表推导，全部满足才能操作且保留任意条件内容', () => {
  const conditions = [
    { id: 'name', satisfied: true, content: createElement('div', null, '商品名称已填写') },
    { id: 'image', satisfied: false, content: createElement('section', null, '主图待上传') },
  ]
  const render = items => renderToStaticMarkup(createElement(PrerequisiteAction, {
    conditions: items, hint: '请完成商品资料', label: '发布商品', onAction() {},
  }))
  const incomplete = render(conditions)
  assert.match(incomplete, /<button[^>]*disabled/)
  assert.match(incomplete, /商品名称已填写/)
  assert.match(incomplete, /主图待上传/)
  const complete = render(conditions.map(item => ({ ...item, satisfied: true })))
  assert.doesNotMatch(complete, /<button[^>]*disabled/)
  assert.doesNotMatch(render([]), /<button[^>]*disabled/)
})

test('日期选择的触发、导航、快捷和应用按钮在表单中均不触发表单提交', () => {
  const markup = renderToStaticMarkup(createElement(DateRangePicker, {
    today: '2026-10-03', value: { start: '2026-10-01', end: '2026-10-03' },
    dataDates: new Set(), onChange() {},
  }))
  const buttons = [...markup.matchAll(/<button\b[^>]*>/g)].map(match => match[0])
  assert.ok(buttons.length > 0)
  for (const button of buttons) assert.match(button, /\btype="button"/, button)
})
