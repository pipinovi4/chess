import appleLogo from '../../../assets/apple-logo.svg'
import facebookLogo from '../../../assets/facebook-logo.svg'
import googleLogo from '../../../assets/google-logo.svg'
import './style.scss'

const SocialRegistration = () => {
    return (
        <div className="alternative-registration__cards">
            <div className="apple-registration">
                <img className='apple-logo' src={appleLogo} alt="" />
                <p className='text-signUp__apple'>Sign up with Apple</p>
            </div>
            <div className="google-registration">
                <img className='google-logo' src={googleLogo} alt="" />
                <p className='text-signUp__google'>Sign up with google</p>
            </div>
            <div className="facebook-registration">
                <img className='facebook-logo' src={facebookLogo} alt="" />
                <p className='text-signUp__facebook'>Sign up with Facebook</p>
            </div>
        </div>
    )
}

export default SocialRegistration
