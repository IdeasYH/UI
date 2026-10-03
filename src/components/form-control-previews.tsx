import { useState } from 'react'
import { ValidatedInput, CountedTextarea, RadioCards, CheckboxCards, PrerequisiteAction, TriStateCheckbox } from './ui/form-controls'

const sessions = [
  { value: 'morning', label: '上午场', detail: '10:00' },
  { value: 'afternoon', label: '下午场', detail: '14:00' },
  { value: 'evening', label: '晚场', detail: '19:00' },
]

export function ValidationPreview() {
  const [email, setEmail] = useState('abc@vibe')
  const error = !email.trim() ? '请填写邮箱' : /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(email) ? undefined : '邮箱格式不对，请检查'
  return <ValidatedInput label="联系邮箱" type="email" value={email} onChange={(event) => setEmail(event.target.value)} error={error} />
}

export function TextareaPreview() {
  const [value, setValue] = useState('想系统过一遍 React 表单，\n最好带点实战作业，\n希望课上现场改自己的报名页。')
  return <CountedTextarea label="学习期待" value={value} onChange={setValue} maxLength={200} />
}

export function RadioPreview() {
  const [value, setValue] = useState('evening')
  return <RadioCards label="选择场次（单选）" options={sessions} value={value} onChange={setValue} />
}

export function CheckboxPreview() {
  const [value, setValue] = useState(['demo-a', 'demo-c'])
  return <CheckboxCards label="选择学员（示例数据，可多选）" options={[
    { value: 'demo-a', label: '阿澈', detail: '上午场 10:00' },
    { value: 'demo-b', label: '小满', detail: '下午场 14:00' },
    { value: 'demo-c', label: '大宇', detail: '晚场 19:00' },
  ]} value={value} onChange={setValue} />
}

export function PrerequisitePreview() {
  const [agreed, setAgreed] = useState(false)
  const [session, setSession] = useState('')
  const [agreementResult, setAgreementResult] = useState('')
  const [sessionResult, setSessionResult] = useState('')
  const [combinedAgreed, setCombinedAgreed] = useState(false)
  const [combinedSession, setCombinedSession] = useState('')
  const [combinedResult, setCombinedResult] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [plan, setPlan] = useState('')
  const missingConditions = [!combinedAgreed && '勾选同意', !confirmed && '确认资料', !combinedSession && '选择场次', !plan && '选择套餐'].filter(Boolean).join('、')
  return <div className="prerequisite-examples">
    <div><PrerequisiteAction hint="勾选后才允许提交" onAction={() => setAgreementResult('已提交示例（未发送真实请求）')} conditions={[
      { id: 'agreement', satisfied: agreed, content: <label><TriStateCheckbox checked={agreed} onChange={(event) => { setAgreed(event.target.checked); setAgreementResult('') }} />我已阅读并同意活动须知（示例）</label> },
    ]} /><p className="form-preview-result" role="status">{agreementResult}</p></div>
    <div><PrerequisiteAction hint="选择场次后才允许提交" onAction={() => setSessionResult('已提交示例（未发送真实请求）')} conditions={[
      { id: 'session', satisfied: !!session, content: <label>选择报名场次<select value={session} onChange={(event) => { setSession(event.target.value); setSessionResult('') }}><option value="">请选择场次</option>{sessions.map((item) => <option value={item.value} key={item.value}>{item.label} {item.detail}</option>)}</select></label> },
    ]} /><p className="form-preview-result" role="status">{sessionResult}</p></div>
    <section aria-label="多个前置条件"><h3 className="prerequisite-example-title">多个条件全部满足后提交</h3>
      <PrerequisiteAction connectEach hint={`还需${missingConditions}`} onAction={() => setCombinedResult('多个条件已满足，已提交示例（未发送真实请求）')} conditions={[
        { id: 'agreement', satisfied: combinedAgreed, content: <label><TriStateCheckbox checked={combinedAgreed} onChange={(event) => { setCombinedAgreed(event.target.checked); setCombinedResult('') }} />同意活动须知（多条件示例）</label> },
        { id: 'confirmation', satisfied: confirmed, content: <label><TriStateCheckbox checked={confirmed} onChange={(event) => { setConfirmed(event.target.checked); setCombinedResult('') }} />确认报名资料无误</label> },
        { id: 'session', satisfied: !!combinedSession, content: <label>选择场次（多条件示例）<select value={combinedSession} onChange={(event) => { setCombinedSession(event.target.value); setCombinedResult('') }}><option value="">请选择场次</option>{sessions.map((item) => <option value={item.value} key={item.value}>{item.label} {item.detail}</option>)}</select></label> },
        { id: 'plan', satisfied: !!plan, content: <label>选择报名套餐<select value={plan} onChange={(event) => { setPlan(event.target.value); setCombinedResult('') }}><option value="">请选择套餐</option><option value="standard">标准版</option><option value="pro">专业版</option></select></label> },
      ]} /><p className="form-preview-result" role="status">{combinedResult}</p>
    </section>
  </div>
}
