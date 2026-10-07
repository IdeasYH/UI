import { TeamActionCard } from '../components/uiverse/team-action-card'

export function UiverseTeamActionCardExample() {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
    <div><p style={{ margin: '0 0 8px' }}>深色版</p><TeamActionCard /></div>
    <div><p style={{ margin: '0 0 8px' }}>白色版</p><TeamActionCard variant="light" /></div>
  </div>
}

export default UiverseTeamActionCardExample
