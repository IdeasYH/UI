import { CrosshairTable } from '../components/ui/crosshair-table'

export function CrosshairTableExample() {
  return <CrosshairTable style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead><tr>{['项目', '本期数量', '上期数量', '状态'].map(label => <th key={label} style={{ padding: 14, textAlign: 'left', borderBottom: '1px solid #e8eaed' }}>{label}</th>)}</tr></thead>
    <tbody>{[['示例项目 A', 128, 116, '进行中'], ['示例项目 B', 86, 90, '已完成'], ['示例项目 C', 64, 52, '进行中'], ['示例项目 D', 42, 38, '待开始']].map((row, index) => <tr key={index}>{row.map((value, column) => <td key={column} style={{ padding: 14, borderBottom: '1px solid #e8eaed' }}>{value}</td>)}</tr>)}</tbody>
  </CrosshairTable>
}
