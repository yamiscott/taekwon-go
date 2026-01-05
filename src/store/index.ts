import { configureStore, combineReducers } from '@reduxjs/toolkit';
import accountReducer from './slices/accountSlice';
import trainingRecordReducer from './slices/trainingRecordSlice';
import trainingReducer from './slices/trainingSlice';
import theoryReducer from './slices/theorySlice';

import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const rootReducer = combineReducers({
  account: accountReducer,
  trainingRecord: trainingRecordReducer,
  training: trainingReducer,
  theory: theoryReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['account', 'training'], // persist account and training slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
