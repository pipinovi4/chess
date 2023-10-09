import React from 'react'
import ReactDOM from 'react-dom/client'
import '../src/styles/App.scss'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import './shared/globalStyle/resetStyle.scss'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
    </React.StrictMode>
)
