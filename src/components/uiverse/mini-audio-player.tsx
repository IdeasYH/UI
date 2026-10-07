import { useRef, useState } from 'react'
import './mini-audio-player.css'

/** A quiet, generated demo melody; no remote media or autoplay. */
function demoAudio() {
  const rate = 8000, seconds = 16, count = rate * seconds
  const buffer = new ArrayBuffer(44 + count * 2), view = new DataView(buffer)
  const text = (offset: number, value: string) => [...value].forEach((char, i) => view.setUint8(offset + i, char.charCodeAt(0)))
  text(0, 'RIFF'); view.setUint32(4, 36 + count * 2, true); text(8, 'WAVE'); text(12, 'fmt ')
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true)
  view.setUint32(24, rate, true); view.setUint32(28, rate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true)
  text(36, 'data'); view.setUint32(40, count * 2, true)
  const notes = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23]
  for (let i = 0; i < count; i++) {
    const t = i / rate, envelope = Math.sin(Math.PI * (t % 1)) ** 2
    view.setInt16(44 + i * 2, Math.sin(2 * Math.PI * notes[Math.floor(t) % notes.length] * t) * envelope * 2200, true)
  }
  let binary = ''
  for (const byte of new Uint8Array(buffer)) binary += String.fromCharCode(byte)
  return `data:audio/wav;base64,${btoa(binary)}`
}
const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
/** Visual adaptation of ahmed150up/quiet-goat-67 (MIT), with real audio controls. */
export function MiniAudioPlayer({ src, title = '演示旋律', artist = '点击播放试听' }: { src?: string; title?: string; artist?: string }) {
  const audio = useRef<HTMLAudioElement>(null)
  const [demo] = useState(demoAudio)
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(src ? 0 : 16)
  const [speed, setSpeed] = useState(1)
  const [error, setError] = useState('')
  async function toggle() {
    if (!audio.current) return
    if (!audio.current.paused) { audio.current.pause(); return }
    try { await audio.current.play(); setError('') } catch { setError('无法播放，请检查音频后重试') }
  }
  return <div className="mini-audio-wrap"><div className="mini-audio-player">
    <audio key={src ?? 'demo'} ref={audio} src={src ?? demo} preload="metadata" onLoadedMetadata={event => { setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0); event.currentTarget.playbackRate = speed }} onLoadStart={() => { setPosition(0); setPlaying(false); setError('') }} onDurationChange={event => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)} onTimeUpdate={event => { setPosition(event.currentTarget.currentTime); setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0) }} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => { setPlaying(false); setError('音频加载失败') }} />
    <div className="mini-audio-disc" aria-hidden>♫</div><div className="mini-audio-controls">
      <div className="mini-audio-heading"><strong>{title}</strong><button type="button" aria-label={`播放倍速 ${speed} 倍`} onClick={() => { const rates = [0.5, 1, 1.25, 1.5, 2]; const next = rates[(rates.indexOf(speed) + 1) % rates.length]; setSpeed(next); if (audio.current) audio.current.playbackRate = next }}>{speed}×</button></div>
      <small>{artist}</small>
      <input type="range" aria-label="播放进度" min={0} max={duration || 1} step={0.1} value={position} disabled={!duration} onChange={event => { const next = Number(event.target.value); if (audio.current) audio.current.currentTime = next; setPosition(next) }} />
      <div className="mini-audio-bottom"><button type="button" aria-label={playing ? '暂停' : '播放'} onClick={toggle}>{playing ? 'Ⅱ' : '▶'}</button><time>{formatTime(position)} / {formatTime(duration)}</time></div>
    </div></div>{error && <p role="alert">{error}</p>}</div>
}
