// @flow

// $FlowIgnore
import { AsyncStorage } from 'react-native'; // eslint-disable-line
import { persistStore } from 'red-per';

export default (store: any, options: {}, callback: any) =>
  persistStore(store, { storage: AsyncStorage, ...options }, callback);
