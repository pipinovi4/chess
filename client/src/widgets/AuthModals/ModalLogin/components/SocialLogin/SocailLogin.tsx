import './style.scss'
import appleLogo from '../../../assets/apple-logo.svg'
import facebookLogo from '../../../assets/facebook-logo.svg'
import googleLogo from '../../../assets/google-logo.svg'

const SocailLogin = () => {
    return (
        <div className="alternative-login__cards">
            <div className="apple-login">
                <img className="apple-logo" src={appleLogo} alt="" />
                <p className="text-signIn__apple">Log in with Apple</p>
            </div>
            <div className="google-login">
                <img className="google-logo" src={googleLogo} alt="" />
                <p className="text-signIn__google">Log in with Google</p>
            </div>
            <div className="facebook-login">
                <img className="facebook-logo" src={facebookLogo} alt="" />
                <p className="text-signIn__facebook">Log in with Facebook</p>
            </div>
        </div>
    )
}

export default SocailLogin
