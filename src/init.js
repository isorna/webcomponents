import { installRouter } from './lib/router.js';
import { installOfflineWatcher } from './lib/network.js'
import { defaultPage, store } from './lib/simplestore.js';
// Required Web Components
import { NProgress } from '../lib/nprogress.js';
import './components/bundle.js';

// Router installation, routes & views are handled within views-wrapper.js
installRouter((location, event) => {
    // Only scroll to top on link clicks, not popstate events.
    if (event && event.type === 'click') {
        window.scrollTo(0, 0);
    }
    // Intercept loggedIn state, then redirect to LOGIN if it's needed.
    let page = location.pathname === '/' ? defaultPage : location.pathname.slice(1);
    store.showNotification('Please log in');
    store.navigateTo(page);
});
// Install Offline Watcher
installOfflineWatcher((offline) => store.updateOffline(offline));

// Configure NProgress
// MORE INFD: https://github.com/rstacruz/nprogress
NProgress.configure({ showSpinner: false });
window.loading = NProgress;