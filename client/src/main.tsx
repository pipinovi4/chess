import React from 'react'
import ReactDOM from 'react-dom/client'
import '../src/styles/App.scss'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import './shared/globalStyle/resetStyle.scss'
import { Provider } from 'react-redux'
import store from './global/store'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <App />
            </Provider>
        </BrowserRouter>
    </React.StrictMode>
)
