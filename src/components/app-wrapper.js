import { store } from '../lib/simplestore.js';

class AppWrapper extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: 'open'});
        this.containerTag = document.createElement('slot');
        this.styleTag = document.createElement('style');
        shadowRoot.appendChild(this.styleTag);
        shadowRoot.appendChild(this.containerTag);
    }
    set showLogin(isVisible) {
        const nodeList = this.containerTag.assignedElements();
        const loginCard = nodeList.filter(element => element.localName === 'login-card')[0];
        if (isVisible) {
            loginCard.setAttribute('active', '');
            this.setAttribute('login', '');
        } else {
            loginCard.removeAttribute('active');
            this.removeAttribute('login');
        }
    }
    get showLogin() {
        return this.hasAttribute('showLogin');
    }
    connectedCallback() {
        window.addEventListener('stateChanged', this._handleStateChanged.bind(this), { passive: true });
        this._setUpStyle();
        this.showLogin = true;
        this._checkSmallScreenBehaviors();
    }
    // Rendering methods
    _setUpStyle() {
        this.styleTag.textContent = `
            @import '/css/app.css';
        `;
    }
    // Event handlers
    _handleStateChanged(e) {
        this._stateChanged(e.detail.changes);
    }
    // Private Methods
    _checkSmallScreenBehaviors() {
        if (window.matchMedia('(max-width: 460px)').matches) {
            this.showSidebar = false;
        } else {
            this.showSidebar = true;
        }
    }
    _forceNavigation(page) {
        window.history.pushState({}, '', page);
        store.navigateTo(page);
    }
    _stateChanged(state) {
        if (state.isLoading !== undefined) {
            if (state.isLoading.length === 0) {
                window.loading.done();
            } else {
                window.loading.start();
            }
        }
        if (state.showSidebar !== undefined) {
            if (state.showSidebar) {
                this.showSidebar = true;
            } else {
                this.showSidebar = false;
            }
        }
        if (state.loggedIn !== undefined) {
            if (state.loggedIn) {
                this.showLogin = false;
                this._checkSmallScreenBehaviors();
            } else {
                this.showSidebar = false;
                this.showLogin = true;
                location.reload();
            }
        }
    }
};
customElements.define('app-wrapper', AppWrapper);
