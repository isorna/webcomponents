let notificationBarTimer;

class NotificationBar extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: 'open'});
        this.containerTag = document.createElement('div');
        this.styleTag = document.createElement('style');
        shadowRoot.appendChild(this.styleTag);
        shadowRoot.appendChild(this.containerTag);
    }
    set active(isActive) {
        if (isActive) {
            this.setAttribute('active', '');
        } else {
            this.removeAttribute('active');
        }
    }
    get active() {
        return this.hasAttribute('active');
    }
    /**
     * @param {string} newVal
     */
    set message(newVal) {
        this.setAttribute('message', newVal);
    }
    get message() {
        return this.getAttribute('message');
    }
    static get observedAttributes() {
        return ['active', 'message'];
    }
    attributeChangedCallback(attr, oldVal, newVal) {
        switch(attr) {
            case 'active':
                if (this.active) {
                    this.containerTag.classList.add('active');
                    window.clearTimeout(notificationBarTimer);
                    notificationBarTimer = window.setTimeout(() => { this.active = false; }, 3000);
                } else {
                    this.containerTag.classList.remove('active');
                    window.clearTimeout(notificationBarTimer);
                }
                break;
            case 'message':
                this._injectContent(newVal);
                break;
        }
    }
    connectedCallback() {
        window.addEventListener('stateChanged', this._handleStateChanged.bind(this), { passive: true });
        this._setUpContent();
        this._setUpStyle();
    }
    // Rendering methods
    _setUpStyle() {
        this.styleTag.textContent = `
        @import '/css/app.css';
        :host {
            display: block;
            position: fixed;
            bottom: -100px;
            left: 0;
            right: 0;
            padding: 1em;
            margin: 0 10px;
            border-radius: 4px;
            background-color: var(--notification-background-color);
            color: var(--notification-font-color);
            text-align: center;
            will-change: transform;
            transform: translate3d(0, 0, 0);
            transition-property: visibility, transform;
            transition-duration: 0.2s;
            visibility: hidden;
        }
        :host([active]) {
            visibility: visible;
            transform: translate3d(0, -110px, 0);
        }
        @media (min-width: 460px) {
            :host {
                width: 320px;
                margin: auto;
            }
        }`;
    }
    _setUpContent() {
        this.containerTag.innerHTML = '';
    }
    _injectContent(textContent) {
        this.containerTag.innerText = textContent;
        this.active = true;
    }
    // Event handlers
    _handleStateChanged(e) {
        this._stateChanged(e.detail.changes);
    }
    // Private Methods
    _stateChanged(state) {
        if (state.offline !== undefined) {
            if (state.offline) {
                this.message = 'Switching to offline mode';
            } else {
                this.message = 'Switching to online mode';
            }
        }
        if (state.message !== undefined && state.message !== null && state.message !== '') {
            this.message = state.message;
        }
    }
};
customElements.define('notification-bar', NotificationBar);
