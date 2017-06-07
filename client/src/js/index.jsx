import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import routes from './routes';
import storeConfig from './store/store.config';

const store = storeConfig();
const app = document.getElementById('app');

ReactDom.render(
  <Provider store={store}>
    {routes}
  </Provider>
  ,
app);
