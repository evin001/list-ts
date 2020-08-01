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
    args: { bookId: string; userId?: string; lastId?: string; reset?: boolean },
    { dispatch }
  ) => {
    try {
      dispatch(loading())
      const quotes = await getQuotes(args)
      return { quotes, reset: args.reset }
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
      const { quotes, reset } = action.payload
      state.quotes = reset ? quotes : state.quotes.concat(quotes)
    })
    builder.addCase(fetchQuotes.rejected, (state, action) => {
      console.log({ action })
    })
  },
})

export default quotesSlice.reducer
