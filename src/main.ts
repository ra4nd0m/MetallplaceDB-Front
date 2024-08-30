import './app.css'
import App from './App.svelte'
import 'bootstrap/dist/css/bootstrap.min.css'
import * as Sentry from '@sentry/svelte';


Sentry.init({
  dsn: `${import.meta.env.VITE_SENTRY_DSN}`,
  //@ts-ignore
  integrations:[
    Sentry.replayIntegration({
      unmask:[".table",".form-control"]
    }),
    Sentry.browserTracingIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0
})

const app = new App({
  target: document.getElementById('app') as Element,
})

export default app
