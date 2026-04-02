import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx'
import './index.css'
import './i18n';

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="771331885302-mkc5sdb5gk53kpdi1ef7i7mpeokmdo8i.apps.googleusercontent.com">
    <StrictMode>
      <App />
    </StrictMode>
  </GoogleOAuthProvider>,
)
