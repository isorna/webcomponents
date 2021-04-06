import { images } from './app-icons.js';

class HomeContent extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: 'open'});
        this.containerTag = document.createElement('slot');
        this.styleTag = document.createElement('style');
        shadowRoot.appendChild(this.styleTag);
        shadowRoot.appendChild(this.containerTag);
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
          --neon-text-color: var(--app-secondary-color);
          --neon-border-color: #08f;

          display: flex;
          height: 100vh;
          align-content: center;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          will-change: visibility;
          transition-property: visibility;
          transition-duration: 0.2s;
          visibility: hidden;
        }
        :host([active]) {
          visibility: visible;
        }
        .neon-title {
          position: absolute;
          overflow: hidden;
          filter: brightness(200%);
          top: calc(50% - 30px);
        }
        .home-title {
          color: var(--app-secondary-color);
          font-size: 40px;
          font-weight: normal;
          font-family: 'Sigmar One', cursive, sans-serif;
          user-select: none;
        }
        .hexagon {
          width: 5%;
          animation: flicker 1.5s infinite alternate;
        }
        .hexagon.grow {
          width: 50%;
          max-width: 460px;
        }
        .plant {
          position: absolute;
          width: 10px;
          animation: flicker 1.5s infinite alternate;
        }
        .plant.grow {
          width: 80px;
        }
        @media (min-width: 460px) {
          .plant {
            bottom: 150px;
          }
          .plant.grow {
            width: 200px;
          }
        }
        /* NEON TITLE: https://codepen.io/comehope/pen/GBwvxw */
        /* NEON ANIMATION: https://codepen.io/GeorgePark/pen/MrjbEr */
        /* Animate neon flicker */
        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            filter: drop-shadow(0 0 .5rem #fff) drop-shadow(0 0 2rem var(--neon-border-color)) drop-shadow(0 0 4rem var(--neon-border-color));
          }
          20%, 24%, 55% {        
            filter: none;
          }
        }
        @keyframes flickerText {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            text-shadow: -0.2rem -0.2rem 1rem #fff, 0.2rem 0.2rem 1rem #fff, 0 0 2rem var(--neon-text-color), 0 0 4rem var(--neon-text-color), 0 0 6rem var(--neon-text-color), 0 0 8rem var(--neon-text-color), 0 0 10rem var(--neon-text-color);
          }
          20%, 24%, 55% {        
            text-shadow: none;
          }
        }
        `;
    }
    _setUpContent() {
        this.containerTag.innerHTML = `
        <h1 class="home-title">Seed World</h1>
        ${images.hexagon}
        ${images.plant}
        `;
        window.setTimeout(() => {
          this.containerTag.querySelector('.hexagon').classList.add('grow');
          this.containerTag.querySelector('.plant').classList.add('grow');
        });
    }
    // Event handlers
    _handleStateChanged(e) {
        this._stateChanged(e.detail.changes);
    }
    // Private Methods
    _stateChanged(state) {
      //...
    }
};
customElements.define('home-content', HomeContent);
