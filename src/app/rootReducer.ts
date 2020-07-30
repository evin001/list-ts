import { combineReducers } from '@reduxjs/toolkit'
import bookDetailsSlice from '~/features/bookDetails/bookDetailsSlice'
import loaderReducer from '~/features/loader/loaderSlice'
import locationReducer from '~/features/location/locationSlice'
import notificationSlice from '~/features/notification/notificationSlice'
import userReducer from '~/features/user/userSlice'

const rootReducer = combineReducers({
  bookDetails: bookDetailsSlice,
  loader: loaderReducer,
  location: locationReducer,
  notification: notificationSlice,
  user: userReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
