import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './slices/accountSlice';
import trainingRecordReducer from './slices/trainingRecordSlice';
import trainingReducer from './slices/trainingSlice';
import theoryReducer from './slices/theorySlice';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    trainingRecord: trainingRecordReducer,
    training: trainingReducer,
    theory: theoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
