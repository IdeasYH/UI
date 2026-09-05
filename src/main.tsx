import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TemplateApp } from './template-app'
import './index.css'
import './template.css'
import './reference.css'
import './organization.css'
import './figma-organization.css'
import './permissions.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TemplateApp />
  </StrictMode>,
)
