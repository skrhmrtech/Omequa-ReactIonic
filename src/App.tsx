import React from 'react';
import { Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Landing from './pages/landing';
import Home from './pages/home/Home';
import Chat from './pages/chat';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
// import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

import { Toaster } from 'react-hot-toast';

import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';

setupIonicReact();

const App: React.FC = () => {

  const [keyboardOpen, setKeyboardOpen] = React.useState(0);

  // Set the global title
  React.useEffect(() => { document.title = "Omequa" }, []);

  React.useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      Keyboard.addListener('keyboardDidShow', (info) => setKeyboardOpen(info?.keyboardHeight - 50));
      Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(0));

      StatusBar.setOverlaysWebView({ overlay: true });
      StatusBar.setBackgroundColor({ color: 'transparent' });
      StatusBar.setStyle({ style: Style.Light });
    }
  }, []);

  return (
    <IonApp className='min-w-[350px] min-h-[450px] overflow-auto' style={{ height: `calc(100vh - ${keyboardOpen}px)` }}>
      <Toaster position="top-center" />
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/" component={Home} />
          <Route exact path="/chat" component={Chat} />
        </IonRouterOutlet>
      </IonReactRouter>
      <Landing />
    </IonApp>
  )
};

export default App;
