import { combineReducers } from '@reduxjs/toolkit'
import bookDetailsSlice from '~/features/bookDetails/bookDetailsSlice'
import loaderReducer from '~/features/loader/loaderSlice'
import locationReducer from '~/features/location/locationSlice'
import userReducer from '~/features/user/userSlice'

const rootReducer = combineReducers({
  user: userReducer,
  bookDetails: bookDetailsSlice,
  location: locationReducer,
  loader: loaderReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
