import { StrictMode, startTransition } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

import App from './App'
import { store } from './app/store'
import './styles/index.css'

// Use startTransition for non-urgent updates
const root = createRoot(document.getElementById('root')!)

startTransition(() => {
  root.render(
    <StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </StrictMode>,
  )
})
