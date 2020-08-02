import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  getQuotes,
  getQuote,
  setQuote as setQuoteAPI,
  Quote,
} from '~/common/api/firebaseAPI'
import { loading, loaded } from '~/features/loader/loaderSlice'
import { redirect } from '~/features/location/locationSlice'
import { success, error } from '~/features/notification/notificationSlice'
import { quotesRoute } from './Routes'

interface QuotesState {
  quotes: Quote[]
  quote?: Quote
}

const thunkPrefix = 'quotes'

export const setQuote = createAsyncThunk(
  `${thunkPrefix}/setQuote`,
  async (quote: Quote, { dispatch }) => {
    try {
      dispatch(loading())
      await setQuoteAPI(quote)
      dispatch(success(`Цитата ${quote.id ? 'обновлена' : 'добавлена'}`))
      dispatch(redirect(quotesRoute(quote.bookId)))
    } catch (e) {
      dispatch(error(`Не удалось ${quote.id ? 'обновить' : 'добавить'} цитату`))
    } finally {
      dispatch(loaded())
    }
  }
)

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
    resetQuote(state) {
      state.quote = void 0
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchQuotes.fulfilled, (state, action) => {
      const { quotes, reset } = action.payload
      state.quotes = reset ? quotes : state.quotes.concat(quotes)
    })

    builder.addCase(fetchQuote.fulfilled, (state, action) => {
      state.quote = action.payload
    })
  },
})

export const { resetQuotes, resetQuote } = quotesSlice.actions

export default quotesSlice.reducer
