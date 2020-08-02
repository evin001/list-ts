import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getQuotes, getQuote, Quote } from '~/common/api/firebaseAPI'
import { loading, loaded } from '~/features/loader/loaderSlice'

interface QuotesState {
  quotes: Quote[]
  quote?: Quote
}

const thunkPrefix = 'quotes'

export const fetchQuote = createAsyncThunk(
  `${thunkPrefix}/fetchQuote`,
  async (quoteId: string, { dispatch }) => {
    try {
      dispatch(loading())
      return await getQuote(quoteId)
    } finally {
      dispatch(loaded())
    }
  }
)

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
  reducers: {
    resetQuotes(state) {
      state.quotes = []
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchQuotes.fulfilled, (state, action) => {
      const { quotes, reset } = action.payload
      state.quotes = reset ? quotes : state.quotes.concat(quotes)
    })
    builder.addCase(fetchQuotes.rejected, (state, action) => {
      console.log({ action })
    })

    builder.addCase(fetchQuote.fulfilled, (state, action) => {
      state.quote = action.payload
    })
    builder.addCase(fetchQuote.rejected, (state, action) => {
      console.log({ action })
    })
  },
})

export const { resetQuotes } = quotesSlice.actions

export default quotesSlice.reducer
