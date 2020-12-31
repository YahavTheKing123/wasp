import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'typeface-roboto';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import rootReducer from './store/reducers';
import initInterceptor from './store/interceptor';
import rosWebsocketInstance from './rosWebsocket';
import externalConfig from './ExternalConfigurationHandler';
import Loader from './components/LoaderAlt/LoaderAlt';
import axios from 'axios';
import config from './config';

ReactDOM.render(
    <React.StrictMode>
        <Loader loadingMessage={'initializing...'} />
    </React.StrictMode>,
    document.getElementById('root')
);

axios.get(config.urls.configuration)
      .then((res) => {
        externalConfig.setConfiguration(res.data);
        renderAplication();
      })
      .catch((e) => {
        console.error('error when trying to retreive configuration.json', e);
      });

function renderAplication() {

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(rootReducer, composeEnhancers(applyMiddleware(reduxThunk)));

    initInterceptor(store);
    rosWebsocketInstance.register(store);

    ReactDOM.render(
        <React.StrictMode>
            <Provider store={store}>
                <App />
            </Provider>
        </React.StrictMode>,
        document.getElementById('root')
    );
}
