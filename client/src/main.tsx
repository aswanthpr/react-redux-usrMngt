import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import "../index.css"
import store from './redux/store.ts'
import ErrorBoundary from "./pages/ErrorBoundary";
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Provider store={store}>
    <ErrorBoundary>
    <App />
    </ErrorBoundary>
    </Provider>
    </BrowserRouter>
  </StrictMode>,
)
