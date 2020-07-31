import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '~/app/rootReducer'
import { getUserBooks, ShortItemList } from '~/common/api/firebaseAPI'
import { loading, loaded } from '~/features/loader/loaderSlice'

interface BookListState {
  shortItemList: ShortItemList[]
}

const initialState: BookListState = {
  shortItemList: [],
}

const thunkPrefix = 'bookList'

export const fetchUserBooks = createAsyncThunk(
  `${thunkPrefix}/fetchUserBooks`,
  async (args: { userId: string; lastItemId: string }, { dispatch }) => {
    try {
      dispatch(loading())
      return await getUserBooks(args.userId, args.lastItemId)
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
      state.shortItemList = state.shortItemList.concat(action.payload)
    })
    builder.addCase(fetchUserBooks.rejected, (state, action) => {
      console.log({ action })
    })
  },
})

export const { resetShortItemList } = bookListSlice.actions

export default bookListSlice.reducer
