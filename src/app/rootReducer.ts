import { combineReducers } from '@reduxjs/toolkit'
import bookDetailsSlice from '~/features/bookDetails/bookDetailsSlice'
import bookListSlice from '~/features/bookList/bookListSlice'
import loaderReducer from '~/features/loader/loaderSlice'
import locationReducer from '~/features/location/locationSlice'
import notificationSlice from '~/features/notification/notificationSlice'
import quotesSlice from '~/features/quotes/quotesSlice'
import userSlice from '~/features/user/userSlice'

const rootReducer = combineReducers({
  bookDetails: bookDetailsSlice,
  bookList: bookListSlice,
  loader: loaderReducer,
  location: locationReducer,
  notification: notificationSlice,
  quotes: quotesSlice,
  user: userSlice,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
