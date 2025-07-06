import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from '../features/auth/authSlice';
import teamReducer from "../features/team/teamSlice";
import kanbanReducer from "../features/team/kanbanSlice";


const rootReducer = combineReducers({
  auth: authReducer,
  team: teamReducer,
  kanban: kanbanReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // ✅ chỉ lưu auth, không lưu team
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;