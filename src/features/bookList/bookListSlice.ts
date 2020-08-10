import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getUserBooks,
  deleteBookFromList as deleteBookFromListAPI,
  ShortItemList,
  ListItemType,
} from '~/common/api/firebaseAPI'
import { loading, loaded } from '~/features/loader/loaderSlice'
import { success, error } from '~/features/notification/notificationSlice'

interface BookListState {
  shortItemList: ShortItemList[]
}

const initialState: BookListState = {
  shortItemList: [],
}

const thunkPrefix = 'bookList'

export const deleteBookFromList = createAsyncThunk(
  `${thunkPrefix}/deleteBookFromList`,
  async (
    args: { userId: string; listId: string; type?: ListItemType },
    { dispatch }
  ) => {
    try {
      dispatch(loading())
      await deleteBookFromListAPI(args.listId, args.userId)
      await dispatch(
        fetchUserBooks({
          userId: args.userId,
          lastItemId: '',
          type: args.type,
          reset: true,
        })
      )
      dispatch(success('Книга удалена из списка'))
    } catch (e) {
      dispatch(error('Не удалось удалить книгу из списка'))
    } finally {
      dispatch(loaded())
    }
  }
)

export const fetchUserBooks = createAsyncThunk(
  `${thunkPrefix}/fetchUserBooks`,
  async (
    args: {
      userId: string
      lastItemId: string
      type?: ListItemType
      reset?: boolean
    },
    { dispatch }
  ) => {
    try {
      dispatch(loading())
      const { userId, lastItemId, type } = args
      const books = await getUserBooks(userId, lastItemId, type)
      return { books, reset: args.reset }
    } finally {
      dispatch(loaded())
    }
  }
)

const bookListSlice = createSlice({
  name: 'bookList',
  initialState,
  reducers: {
    resetShortItemList(state) {
      state.shortItemList = []
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserBooks.fulfilled, (state, action) => {
      const { books, reset } = action.payload
      state.shortItemList = reset ? books : state.shortItemList.concat(books)
    })
    builder.addCase(fetchUserBooks.rejected, (state, action) => {
      console.log({ action })
    })
  },
})

export const { resetShortItemList } = bookListSlice.actions

export default bookListSlice.reducer
