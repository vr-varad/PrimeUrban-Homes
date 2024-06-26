import { combineReducers, configureStore} from '@reduxjs/toolkit'
import userReducer from './user/userslice'
import storage from 'redux-persist/lib/storage'
import {persistStore, persistReducer} from 'redux-persist'


const rootReducer = combineReducers({
    user: userReducer

})

const persistConfig = {
    key : 'root',
    storage,
    version : 1
}


const persistedReducer = persistReducer(persistConfig,rootReducer)


export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
        ignoredActions: ['your/action/type']
    })
})

export const persistor = persistStore(store)