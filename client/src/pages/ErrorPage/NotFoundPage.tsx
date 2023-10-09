import { useNavigate } from 'react-router-dom' // Импорт Link для создания ссылки
import './style.scss'

const NotFoundPage = () => {
    const navigate = useNavigate()

    const redirectHome = () => {
        navigate('/home', {replace: true})
    }
    return (
        <div className="container-not-found">
                <h1 className="title-status">404 - Page Not Found</h1>
                <p className="validation-error">
                    Please check the URL and try again.
                </p>
            <div className='container-redirect'>
                <p className="text-proposal">Alternatively, you can </p>
                <button onClick={redirectHome} className="button-go__home">
                    Go to home
                </button>
            </div>
        </div>
    )
}

export default NotFoundPage
