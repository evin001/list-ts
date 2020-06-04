import { combineReducers } from '@reduxjs/toolkit'
import bookDetailsSlice from '~/features/bookDetails/bookDetailsSlice'
import userReducer from '~/features/user/userSlice'

const rootReducer = combineReducers({
  user: userReducer,
  bookDetails: bookDetailsSlice,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
