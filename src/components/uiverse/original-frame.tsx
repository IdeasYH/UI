/** Preserve each Uiverse author's HTML and CSS inside its own document. */
export function OriginalFrame({ slug, title, height }: { slug: string; title: string; height: number }) {
  return <iframe
    title={title}
    src={`/uiverse-originals/${slug}.preview.html`}
    sandbox=""
    loading="lazy"
    style={{ display: 'block', width: '100%', height, border: 0, background: 'transparent' }}
  />
}
