import { Workbox } from 'https://storage.googleapis.com/workbox-cdn/releases/4.1.0/workbox-window.prod.mjs';
if ('serviceWorker' in navigator) {
    const wb = new Workbox('/service-worker.js');
    // Add an event listener to detect when the registered
    // service worker has installed but is waiting to activate.
    wb.addEventListener('waiting', (event) => {
        // `event.wasWaitingBeforeRegister` will be false if this is
        // the first time the updated service worker is waiting.
        // When `event.wasWaitingBeforeRegister` is true, a previously
        // updated same service worker is still waiting.
        // You may want to customize the UI prompt accordingly.
        let reloadSW = true;
        // TODO: Create CONFIRM dialog accordingly, if it's necessary
        // let reloadSW = window.confirm('New version available, reload?');
        if (reloadSW) {
            // Assuming the user accepted the update, set up a listener
            // that will reload the page as soon as the previously waiting
            // service worker has taken control.
            wb.addEventListener('controlling', (event) => {
                window.location.reload();
            });

            // Send a message telling the service worker to skip waiting.
            // This will trigger the `controlling` event handler above.
            // Note: for this to work, you have to add a message
            // listener in your service worker. See below.
            wb.messageSW({type: 'SKIP_WAITING'});
        }
    });

    wb.register();
}
// FROM: https://developers.google.com/web/fundamentals/codelabs/your-first-pwapp/#add_install_experience
// ALSO: https://developers.google.com/web/fundamentals/app-install-banners/#detect-mode
let deferredInstallPrompt = null;
// window.installButton = document.getElementById('install-button');
// if (window.installButton) {
//     window.installButton.addEventListener('click', installPWA);
// }

// Add event listener for beforeinstallprompt event
window.addEventListener('beforeinstallprompt', saveBeforeInstallPromptEvent);

/**
 * Event handler for beforeinstallprompt event.
 *   Saves the event & shows install button.
 *
 * @param {Event} evt
 */
function saveBeforeInstallPromptEvent(evt) {
    // Add code to save event & show the install button.
    deferredInstallPrompt = evt;
    if (window.installButton) {
        window.installButton.parentElement.removeAttribute('hidden');
    }
}


/**
 * Event handler for butInstall - Does the PWA installation.
 *
 * @param {Event} evt
 */
function installPWA(evt) {
    // Add code show install prompt & hide the install button.
    deferredInstallPrompt.prompt();
    // Hide the install button, it can't be called twice.
    window.installButton.parentElement.setAttribute('hidden', true);
    // Log user response to prompt.
    deferredInstallPrompt.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt', choice);
        } else {
            console.log('User dismissed the A2HS prompt', choice);
        }
        deferredInstallPrompt = null;
    });
}
window.installPWA = installPWA;

// Add event listener for appinstalled event
window.addEventListener('appinstalled', logAppInstalled);

/**
 * Event handler for appinstalled event.
 *   Log the installation to analytics or save the event somehow.
 *
 * @param {Event} evt
 */
function logAppInstalled(evt) {
    // Add code to log the event
    console.log('App was installed.', evt);
    // Hide the install button, it can't be called twice.
    window.installButton.parentElement.setAttribute('hidden', true);
}