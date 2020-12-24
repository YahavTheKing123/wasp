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
import { websocketRegistration } from './store/websocketRegistration';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
	rootReducer,	
	composeEnhancers(applyMiddleware(reduxThunk))
);

initInterceptor(store);
websocketRegistration(store);

ReactDOM.render(  
  <React.StrictMode>
    <Provider store={store}>
        <App />		
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
