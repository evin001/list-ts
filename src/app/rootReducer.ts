import { combineReducers } from '@reduxjs/toolkit'
import bookDetailsSlice from '~/features/bookDetails/bookDetailsSlice'
import locationReducer from '~/features/location/locationSlice'
import userReducer from '~/features/user/userSlice'

const rootReducer = combineReducers({
  user: userReducer,
  bookDetails: bookDetailsSlice,
  location: locationReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
