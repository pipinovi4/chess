import { lazy, Suspense, useEffect, useState } from 'react'
import {
    Route,
    Routes,
    Navigate,
    useNavigate,
    useLocation,
} from 'react-router-dom'
import LeftBar from './widgets/leftBar/LeftBar'
import ErrorPage from './pages/ErrorPage/NotFoundPage'
import LoadingPage from './pages/LoadingPage/LoadingPage.tsx'

const HomePage = lazy(() => import('./pages/HomePage/HomePage.tsx'))
const PlayPage = lazy(() => import('./pages/PlayPage/PlayPage.tsx'))
const PlayComputer = lazy(
    () => import('./pages/PlayComputerPage/PlayComputer.tsx')
)
const PlayOnline = lazy(() => import('./pages/PlayOnlinePage/PlayOnline.tsx'))

const App = () => {
    const [isActiveLogin, setIsActiveLogin] = useState(false)
    const [isActiveRegistration, setIsActiveRegistration] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken')
        if (location.pathname === '/play/online' && !accessToken) {
            navigate('/')
            setIsActiveLogin(true)
        }
    }, [location.pathname, navigate])

    const isNotFoundPage = location.pathname === '/not-found'
    return (
        <>
            {!isNotFoundPage && (
                <LeftBar
                    isActiveLogin={isActiveLogin}
                    isActiveRegistration={isActiveRegistration}
                    setIsActiveLogin={setIsActiveLogin}
                    setIsActiveRegistration={setIsActiveRegistration}
                />
            )}
            <Routes>
                <Route
                    path={'/home' || '/'}
                    element={
                        <Suspense fallback={<LoadingPage />}>
                            <HomePage />
                        </Suspense>
                    }
                />
                <Route
                    path="/play"
                    element={
                        <Suspense fallback={<LoadingPage />}>
                            <PlayPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/play/computer"
                    element={
                        <Suspense fallback={<LoadingPage />}>
                            <PlayComputer />
                        </Suspense>
                    }
                />
                <Route
                    path="/play/online"
                    element={
                        <Suspense fallback={<LoadingPage />}>
                            <PlayOnline />
                        </Suspense>
                    }
                />
                <Route
                    path="/play/online/:roomId"
                    element={
                        <Suspense fallback={<LoadingPage />}>
                            {localStorage.getItem('accessToken') ? (
                                <PlayOnline />
                            ) : (
                                <Navigate to="/home" />
                            )}
                        </Suspense>
                    }
                />
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/*" element={<Navigate to="/not-found" />} />
                <Route
                    path="/not-found"
                    element={
                        <Suspense fallback={<LoadingPage />}>
                            <ErrorPage />
                        </Suspense>
                    }
                />
            </Routes>
        </>
    )
}

export default App
