import React, { lazy, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import LeftBar from './widgets/leftBar/LeftBar'
import ErrorPage from './pages/ErrorPage/NotFoundPage'

const HomePage = lazy(() => import('./pages/HomePage/HomePage.tsx'))
const RegistrationPage = lazy(() => import('./pages/RegistrationPage.tsx'))
const LoginPage = lazy(() => import('./pages/LoginPage.tsx'))
const ProfilePage = lazy(() => import('./pages/ProfilePage.tsx'))
const PlayPage = lazy(() => import('./pages/PlayPage/PlayPage.tsx'))
const PlayComputer = lazy(() => import('./pages/PlayComputer.tsx'))
const PlayOnline = lazy(() => import('./pages/PlayOnline/PlayOnline.tsx'))

const App = () => {
    return (
        <>
            <LeftBar />
            <Routes>
                <Route
                    path="/"
                    element={
                        <Suspense fallback={<h2>Loading...</h2>}>
                            <HomePage />
                        </Suspense>
                    }
                />
                <Route
                    path="/profile/:userName"
                    element={
                        <Suspense fallback={<h2>Loading...</h2>}>
                            <ProfilePage />
                        </Suspense>
                    }
                />
                <Route
                    path="/play"
                    element={
                        <Suspense fallback={<h2>Loading...</h2>}>
                            <PlayPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/play/computer"
                    element={
                        <Suspense fallback={<h2>Loading...</h2>}>
                            <PlayComputer />
                        </Suspense>
                    }
                />
                <Route
                    path="/play/online"
                    element={
                        <Suspense fallback={<h2>Loading...</h2>}>
                            <PlayOnline />
                        </Suspense>
                    }
                />
                <Route
                    path="/play/online/:roomId"
                    element={
                        <Suspense fallback={<h2>Loading...</h2>}>
                            <PlayOnline />
                        </Suspense>
                    }
                />
                <Route path="/analis" element={<></>} />
                <Route path="/friends" element={<></>} />
                <Route
                    path="registration"
                    element={
                        <Suspense fallback={<h2>Loading...</h2>}>
                            <RegistrationPage />
                        </Suspense>
                    }
                />
                <Route path="/" element={<Navigate to="/home" />} />
                <Route
                    path="login"
                    element={
                        <Suspense fallback={<h2>Loading...</h2>}>
                            <LoginPage />
                        </Suspense>
                    }
                />
                <Route path="/*" element={<Navigate to="/not-found" />} />
                <Route
                    path="/not-found"
                    element={
                        <Suspense fallback={<h2>Loading...</h2>}>
                            <ErrorPage />
                        </Suspense>
                    }
                />
            </Routes>
        </>
    )
}

export default App
