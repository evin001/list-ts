import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getQuotes, Quote } from '~/common/api/firebaseAPI'
import { loading, loaded } from '~/features/loader/loaderSlice'

interface QuotesState {
  quotes: Quote[]
}

const thunkPrefix = 'quotes'

export const fetchQuotes = createAsyncThunk(
  `${thunkPrefix}/fetchQuotes`,
  async (
    args: { bookId: string; userId?: string; lastId?: string },
    { dispatch }
  ) => {
    try {
      dispatch(loading())
      return await getQuotes(args)
    } finally {
      dispatch(loaded())
    }
  }
)

const initialState: QuotesState = {
  quotes: [],
}

const quotesSlice = createSlice({
  name: 'quotes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchQuotes.fulfilled, (state, action) => {
      state.quotes = action.payload
    })
    builder.addCase(fetchQuotes.rejected, (state, action) => {
      console.log({ action })
    })
  },
})

export default quotesSlice.reducer
