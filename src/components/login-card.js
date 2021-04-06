import {
    icons
} from './app-icons.js';
import { store } from '../lib/simplestore.js';

class LoginCard extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: 'open'});
        this.containerTag = document.createElement('slot');
        this.styleTag = document.createElement('style');
        shadowRoot.appendChild(this.styleTag);
        shadowRoot.appendChild(this.containerTag);
        // Login / SingUp / Verification properties:
        this.username = '';
        this.password = '';
        this.verifyPassword = '';
        this.verificationCode = '';
        this.newPassword = '';
        this.phone = '';
        this.email = '';
        this.codeDeliveryDetailsEmail = '';

        this.isSignUp = false;
        this.isConfirmSignUp = false;
        this.isPasswordRecovery = false;
        this.isPasswordChange = false;
        this.isSignIn = false;

        this.signUpForm_isValid = false;
        this.confirmSignUpForm_isValid = false;
        this.passwordRecoveryForm_isValid = false;
        this.passwordChangeForm_isValid = false;
        this.signInForm_isValid = false;

        if (window.location.search.indexOf('new-account=') > 0) {
            // example: ?new-account=your@email.com
            this.isSignUp = true;
            this.username = window.location.search.slice(1).split('&').find(value => value.includes('new-account')).split('=')[1];
        } else if (window.location.search.indexOf('verification-code=') > 0) {
            // example: ?user-name=your@email.com&verification-code=####
            this.isConfirmSignUp = true;
            this.username = window.location.search.slice(1).split('&').find(value => value.includes('user-name')).split('=')[1];
            this.verificationCode = window.location.search.slice(1).split('&').find(value => value.includes('verification-code')).split('=')[1];
        } else if (window.location.search.indexOf('recover-password=') > 0) {
            this.isPasswordRecovery = true;
            this.username = window.location.search.slice(1).split('&').find(value => value.includes('recover-password')).split('=')[1];
        } else if (window.location.search.indexOf('change-password=') > 0) {
            this.isPasswordChange = true;
            this.username = window.location.search.slice(1).split('&').find(value => value.includes('change-password')).split('=')[1];
        } else {
            this.isSignIn = true;
        }
    }
    connectedCallback() {
        this._setUpStyle();
        this._setUpContent();
    }
    // Rendering methods
    _setUpStyle() {
        this.styleTag.textContent = `
        @import '/css/app.css';
        :host {
            display: none;
            flex-direction: column;
            justify-content: center;
            align-content: center;
            flex-wrap: wrap;
            opacity: 0;
            height: 100vh;
        }
        :host([active]) {
            opacity: 1;
            display: flex;
        }
        .card-title {
            color: var(--app-blue-color);
            text-align: center;
            line-height: 100px;
        }
        .card-subtitle {
            font-weight: normal;
            flex-basis: 100%;
            margin: 4px 0 10px;
        }
        form {
            background-color: var(--app-white-color);
            margin: 0 10px;
            padding: 20px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-content: center;
            flex-wrap: wrap;
        }
        form p {
            flex-basis: 100%;
            margin-bottom: 10px;
        }
        .form-actions {
            flex-basis: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-content: center;
        }
        .form-single-action {
            flex-basis: 100%;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-content: center;
        }
        #copy {
            text-align: center;
            line-height: 50px;
        }
        `;
    }
    _setUpContent() {
        const cardTitle = `<h1 class="card-title">${icons.home}</h1>`;
        const cardFooter = '<div id="copy"><p>&copy;2019</p></div>';
        const passwordValidity = 'Validation: 12 characters, at least 1 uppercase, 1 lowercase, 1 decimal y 1 special';
        const mandatoryField = '<p class="input-hint">* Mandatory</p>';
        const codeDeliveryDetailsText = `We've sent an email to ${this.codeDeliveryDetailsEmail !== '' ? this.codeDeliveryDetailsEmail : 'your email'}`;
        let cardForm = '';

        if (this.isSignUp) {
            cardForm = `
            ${cardTitle}
            <form id="signup-form">
                <h2 class="card-subtitle">Create your account</h2>
                <p>You're creating an account for the user:</p>
                <input id="username" type="text" placeholder="User *" value="${this.username}" readonly />
                <p>Choose a valid password:</p>
                <input id="password" type="password" class="password-icon" placeholder="Password *" value="${this.password}" required title="${passwordValidity}" />
                ${mandatoryField}
                <input id="verifyPassword" type="password" class="password-icon" placeholder="Verify your password *" value="${this.verifyPassword}" required title="${passwordValidity}" />
                ${mandatoryField}
                <p>Once your account is validated, you'll receive an email with the login instructions.</p>
                <div class="form-actions">
                    <button id="button_cancelSignUp" tabindex="-1" type="button" class="no-cta-button">${icons.arrowBack}Back</button>
                    <button id="button_submitSignUp" type="submit" form="signup-form" class="cta-button">Validate</button>
                </div>
            </form>
            `;
        } else if (this.isConfirmSignUp) {
            cardForm = `
            <form id="confirm-signup-form">
                <h2 class="card-subtitle">Confirm your user</h2>
                <input id="username" type="text" placeholder="User *" value="${this.username}" readonly />
                <p>${codeDeliveryDetailsText}</p>
                <input id="verificationCode" type="text" placeholder="Verification code *" value="${this.verificationCode}" required />
                ${mandatoryField}
                <div class="form-actions">
                    <button id="button_cancelConfirmSignUp" tabindex="-1" type="button" class="no-cta-button">${icons.arrowBack}Back</button>
                    <button id="button_submitConfirmSignUp" type="submit" form="signup-form" class="cta-button">Confirm</button>
                </div>
            </form>
            `;
        } else if (this.isPasswordRecovery) {
            cardForm = `
            <form id="password-recovery-form">
                <h2 class="card-subtitle">Recover your account</h2>
                <p>Write your username to recover your password</p>
                <input id="username" type="text" placeholder="User *" value="${this.username}" required />
                <div class="form-actions">
                    <button id="button_cancelPasswordRecovery" tabindex="-1" type="button" class="no-cta-button">${icons.arrowBack}Back</button>
                    <button id="button_submitPasswordRecovery" type="submit" form="password-recovery-form" class="cta-button">Send</button>
                </div>
            </form>
            `;
        } else if (this.isPasswordChange) {
            cardForm = `
            <form id="password-change-form">
                <h2 class="card-subtitle">Change your password</h2>
                <input id="username" type="text" placeholder="User *" value="${this.username}" readonly />
                <p>${codeDeliveryDetailsText}</p>
                <input id="verificationCode" type="text" placeholder="Verification code *" value="${this.verificationCode}" required />
                ${mandatoryField}
                <input id="newPassword" type="password" class="password-icon" placeholder="New password *" value="${this.newPassword}" required title="${passwordValidity}" />
                ${mandatoryField}
                <input id="verifyPassword" type="password" class="password-icon" placeholder="Verify your password *" value="${this.verifyPassword}" required title="${passwordValidity}" />
                ${mandatoryField}
                <div class="form-actions">
                    <button id="button_cancelPasswordChange" tabindex="-1" type="button" class="no-cta-button">${icons.arrowBack}Back</button>
                    <button id="button_submitPasswordChange" type="submit" form="password-change-form" class="cta-button">Confirm</button>
                </div>
            </form>
            `;
        } else {// Sign In
            cardForm = `
            <form id="signin-form">
                <h2 class="card-subtitle">Sign In</h2>
                <input id="username" type="text" placeholder="User *" value="${this.username}" required />
                ${mandatoryField}
                ${this.showUseNewPassword ? `<p>Remember, you've to use the password you've just changed</p>`: ''}
                <input id="password" type="password" class="password-icon" placeholder="Password *" value="${this.password}" required title="${passwordValidity}" />
                ${mandatoryField}
                <div class="form-single-action"><button id="button_submitSignIn" type="submit" form="signin-form" class="cta-button">Sign In</button></div>
                <div class="form-single-action"><button id="button_showPasswordRecoveryForm" class="link-button" tabindex="-1" type="button">Don't remember your password?</button></div>
            </form>
            `;
        }
        this.containerTag.innerHTML = `${cardTitle}${cardForm}${cardFooter}`;
        // Handle inputs
        this.containerTag.querySelectorAll('#username').forEach(node => node.addEventListener('input', this.username_handleInput.bind(this)));
        this.containerTag.querySelectorAll('#verificationCode').forEach(node => node.addEventListener('input', this.verificationCode_handleInput.bind(this)));
        this.containerTag.querySelectorAll('#newPassword').forEach(node => node.addEventListener('input', this.newPassword_handleInput.bind(this)));
        this.containerTag.querySelectorAll('#verifyPassword').forEach(node => node.addEventListener('input', this.verifyPassword_handleInput.bind(this)));
        this.containerTag.querySelectorAll('#password').forEach(node => node.addEventListener('input', this.password_handleInput.bind(this)));
        this.containerTag.querySelectorAll('.password-icon + .input-hint').forEach(node => node.addEventListener('click', this.passwordShowHide.bind(this)));
        // Form methods
        this.containerTag.querySelectorAll('#signup-form').forEach(node => node.addEventListener('submit', this.singUpForm_submit.bind(this)));
        this.containerTag.querySelectorAll('#confirm-signup-form').forEach(node => node.addEventListener('submit', this.confirmSignUpForm_submit.bind(this)));
        this.containerTag.querySelectorAll('#password-recovery-form').forEach(node => node.addEventListener('submit', this.passwordRecoveryForm_submit.bind(this)));
        this.containerTag.querySelectorAll('#password-change-form').forEach(node => node.addEventListener('submit', this.passwordChangeForm_submit.bind(this)));
        this.containerTag.querySelectorAll('#signin-form').forEach(node => node.addEventListener('submit', this.signInForm_submit.bind(this)));
        // Button methods
        this.containerTag.querySelectorAll('#button_cancelSignUp').forEach(node => node.addEventListener('click', this.cancelSignUp.bind(this)));
        this.containerTag.querySelectorAll('#button_submitSignUp').forEach(node => node.addEventListener('click', this.singUpForm_submit.bind(this)));
        this.containerTag.querySelectorAll('#button_cancelConfirmSignUp').forEach(node => node.addEventListener('click', this.cancelConfirmSignUp.bind(this)));
        this.containerTag.querySelectorAll('#button_submitConfirmSignUp').forEach(node => node.addEventListener('click', this.confirmSignUpForm_submit.bind(this)));
        this.containerTag.querySelectorAll('#button_cancelPasswordRecovery').forEach(node => node.addEventListener('click', this.cancelPasswordRecovery.bind(this)));
        this.containerTag.querySelectorAll('#button_submitPasswordRecovery').forEach(node => node.addEventListener('click', this.passwordRecoveryForm_submit.bind(this)));
        this.containerTag.querySelectorAll('#button_cancelPasswordChange').forEach(node => node.addEventListener('click', this.cancelPasswordChange.bind(this)));
        this.containerTag.querySelectorAll('#button_submitPasswordChange').forEach(node => node.addEventListener('click', this.passwordChangeForm_submit.bind(this)));
        this.containerTag.querySelectorAll('#button_showPasswordRecoveryForm').forEach(node => node.addEventListener('click', this.showPasswordRecoveryForm.bind(this)));
        this.containerTag.querySelectorAll('#button_submitSignIn').forEach(node => node.addEventListener('click', this.signInForm_submit.bind(this)));
    }
    // Event handlers
    // Input handlers
    username_handleInput(e) {
        this.username = e.target.value;
        if (this.isPasswordRecovery) {
            this.passwordRecoveryForm_checkValid();
        } else if (this.isSignIn) {
            this.signInForm_checkValid();
        }
    }
    password_handleInput(e) {
        this.password = e.target.value;
        if (this.isSignUp) {
            this.signUpForm_checkValid();
        } else if (this.isSignIn) {
            this.signInForm_checkValid();
        }
    }
    verificationCode_handleInput(e) {
        this.verificationCode = e.target.value;
        if (this.isConfirmSignUp) {
            this.confirmSignUpForm_checkValid();
        } else if (this.isPasswordChange) {
            this.passwordChangeForm_checkValid();
        }
    }
    newPassword_handleInput(e) {
        this.newPassword = e.target.value;
        this.passwordChangeForm_checkValid();
    }
    verifyPassword_handleInput(e) {
        this.verifyPassword = e.target.value;
        if (this.isSignUp) {
            this.signUpForm_checkValid();
        } else if (this.isPasswordChange) {
            this.passwordChangeForm_checkValid();
        }
    }
    // Form checkers
    signUpForm_checkValid() {
        this.signUpForm_isValid = this.username !== '' && this.password !== '' && this.verifyPassword === this.password;
    }
    confirmSignUpForm_checkValid() {
        this.confirmSignUpForm_isValid = this.username !== '' && this.verificationCode !== '';
    }
    passwordRecoveryForm_checkValid() {
        this.passwordRecoveryForm_isValid = this.username !== '';
    }
    passwordChangeForm_checkValid() {
        this.passwordChangeForm_isValid = this.verificationCode !== '' && this.newPassword !== '' && this.verifyPassword === this.newPassword;
    }
    signInForm_checkValid() {
        this.signInForm_isValid = this.username !== '' && this.password !== '';
    }
    // Form submits
    singUpForm_submit(e) {
        e.preventDefault();
        if (!e.target.disabled) {
            this.signUpForm_checkValid();
            if (this.signUpForm_isValid) {
                store.startLoading();
                // Sign Up
                // ...
                store.showNotification(`User: ${this.username} has been created successfully`);
                store.endLoading();
            }
        }
    }
    confirmSignUpForm_submit(e) {
        e.preventDefault();
        if (!e.target.disabled) {
            this.confirmSignUpForm_checkValid();
            if (this.confirmSignUpForm_isValid) {
                store.startLoading();
                // Confirm Sign Up
                // ...
                store.showNotification(`User: ${this.username} confirmed`);
                store.endLoading();
            }
        }
    }
    passwordRecoveryForm_submit(e) {
        e.preventDefault();
        if (!e.target.disabled) {
            this.passwordRecoveryForm_checkValid();
            if (this.passwordRecoveryForm_isValid) {
                store.startLoading();
                // Forgot Password
                // ...
                store.endLoading();
            }
        }
    }
    passwordChangeForm_submit(e) {
        e.preventDefault();
        if (!e.target.disabled) {
            this.passwordChangeForm_checkValid();
            if (this.passwordChangeForm_isValid) {
                // Forgot Password Submit
                // ...
                store.endLoading();
            }
        }
    }
    signInForm_submit(e) {
        e.preventDefault();
        if (!e.target.disabled) {
            this.signInForm_checkValid();
            if (this.signInForm_isValid) {
                store.startLoading();
                // Sign In
                // ...
                store.endLoading();
            }
        }
    }
    cancelSignUp(e) {
        if (!e.target.disabled) {
            this.isSignUp = false;
            this._setUpContent();
        }
    }
    cancelConfirmSignUp(e) {
        if (!e.target.disabled) {
            this.isSignUp = true;
            this.isConfirmSignUp = false;
            this._setUpContent();
        }
    }
    cancelPasswordRecovery(e) {
        if (!e.target.disabled) {
            this.isPasswordRecovery = false;
            this._setUpContent();
        }
    }
    cancelPasswordChange(e) {
        if (!e.target.disabled) {
            this.isPasswordChange = false;
            this._setUpContent();
        }
    }
    showPasswordRecoveryForm(e) {
        if (!e.target.disabled) {
            this.isSignIn = false;
            this.isPasswordRecovery = true;
            this._setUpContent();
        }
    }
    passwordShowHide(e) {
        if (e.offsetY < 0) {// Means user is clicking the pseudo-element (icon)
            e.srcElement.previousElementSibling.setAttribute('type', (e.srcElement.previousElementSibling.getAttribute('type') === 'password' ? 'text' : 'password'));
        }
    }
    resetLoginForm(e) {
        this.username = '';
        this.password = '';
        this.verifyPassword = '';
        this.verificationCode = '';
        this.newPassword = '';
        this.phone = '';
        this.email = '';
        this.codeDeliveryDetailsEmail = '';

        this.isSignIn = false;
        this.isSignUp = false;
        this.isConfirmSignUp = false;
        this.isPasswordRecovery = false;
        this.isPasswordChange = false;

        this.signUpForm_isValid = false;
        this.confirmSignUpForm_isValid = false;
        this.signInForm_isValid = false;
        this.passwordRecoveryForm_isValid = false;
        this.passwordChangeForm_isValid = false;

        this.isSignIn = true;
        window.location.search = '';
        this._setUpContent();
    }
};
customElements.define('login-card', LoginCard);
