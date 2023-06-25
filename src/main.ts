import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'

/* Fonts */
import '@fontsource-variable/lora';
import '@fontsource-variable/nunito';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
    faArrowUp, 
    faChevronUp, 
    faChevronDown, 
    faMagnifyingGlass, 
    faArrowDown, 
    faComment, 
    faCircleNotch,
    faRing,
    faMessage,
} from '@fortawesome/free-solid-svg-icons'

import type { Settings } from './models/settings';

import App from './App.vue'
import router from './router'
import { createAuth0 } from '@auth0/auth0-vue';

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())

library.add(faMagnifyingGlass);
library.add(faChevronUp);
library.add(faChevronDown);
library.add(faArrowUp);
library.add(faArrowDown);
library.add(faComment);
library.add(faCircleNotch);
library.add(faRing);
library.add(faMessage);



// We add _settings to window
fetch('/settings.json').then((response) => {
    return response.json()
}).then((settings: Settings) => {
    window._settings = settings
    app.use(router)
    app.use(
        createAuth0({
          domain: window._settings.auth0Domain,
          clientId: window._settings.auth0ClientId,
          authorizationParams: {
            redirect_uri: window.origin + '/login/callback',
          }
        })
      );
    app.mount('#app')
})





// We extend window to include _settings
declare global {
    interface Window {
        _settings: Settings,
    }
}
