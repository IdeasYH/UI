import { LuminaryCardCustomizer } from '../components/luminary-card/luminary-card'
import '../pages/luminary-card-page.css'

/** 完整定制器需要明确高度；所有文件与素材的复制边界见对应契约。 */
export function LuminaryCardExample() {
  return <section className="luminary-workspace" aria-label="全息卡片定制器示例"><LuminaryCardCustomizer /></section>
}
