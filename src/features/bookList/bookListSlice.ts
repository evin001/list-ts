import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
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
  async (args: { userId: string }, { dispatch }) => {
    try {
      dispatch(loading())
      return await getUserBooks(args.userId)
    } finally {
      dispatch(loaded())
    }
  }
)

const bookListSlice = createSlice({
  name: 'bookList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserBooks.pending, (state) => {
      state.shortItemList = []
    })
    builder.addCase(fetchUserBooks.fulfilled, (state, action) => {
      state.shortItemList = action.payload
    })
    builder.addCase(fetchUserBooks.rejected, (state, action) => {
      console.log({ action })
    })
  },
})

export default bookListSlice.reducer
