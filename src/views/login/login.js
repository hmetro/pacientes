import Auth from '../../models/auth';
import HeaderPublic from '../layout/header-public';
import FooterPublic from '../layout/footer-public';
import FormLogin from './formlogin';
import App from '../app';

class Login extends App {
    constructor() {
        super();
    }
    oninit() {
        if (Auth.isLogin()) {
            window.location.href = 'https://www.hospitalmetropolitano.org/es/cuenta';

            // return m.route.set('/inicio');
        }
        window.location.href = 'https://www.hospitalmetropolitano.org/es/cuenta';
    }
    oncreate() {
        this.mainLayout();
        submitLogin();

    }
    view() {
        window.location.href = 'https://www.hospitalmetropolitano.org/es/cuenta';

        /*
        return [
            m(HeaderPublic),
            m(FormLogin),
            m(FooterPublic)
        ];
        */
    }
};

function submitLogin() {
    document.onkeypress = function (e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == "13") {
            if (Auth.canSubmit()) {
                document.getElementsByTagName('button')[0].click();
            }
        }
    };
}


export default Login;