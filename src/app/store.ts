import { ThunkAction, Action, configureStore } from '@reduxjs/toolkit'
import rootReducer, { RootState } from './rootReducer'

const store = configureStore({
  reducer: rootReducer,
})

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>

export default store
