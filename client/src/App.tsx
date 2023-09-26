import { useEffect } from 'react'
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom'
import RegistrationPage from './pages/RegistrationPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import PlayPages from './pages/PlayPages'
import PlayOnline from './pages/PlayOnline'
import PlayComputer from './pages/PlayComputer'
import ErrorPage from './pages/ErrorPage'

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/home" element={<HomePage />} />
                <Route path="/registration" element={<RegistrationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile/:userName" element={<ProfilePage />} />
                <Route path="/play" element={<PlayPages />} />
                <Route path='/play/computer' element={<PlayComputer/>}/>
                <Route path='/play/online' element={<PlayOnline/>}/>
                <Route path='/play/online/:roomId' element={<PlayOnline/>}/>
                <Route path='/error-page' element={<ErrorPage/>}/>

                <Route path="/" element={<Navigate to="/home" />} />
                <Route path='*' element={<Navigate to="/error-page" />} />
            </Routes>
        </>
    )
}

export default App
