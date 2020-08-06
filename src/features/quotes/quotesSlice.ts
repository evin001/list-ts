import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '~/app/rootReducer'
import {
  getQuotes,
  getQuote,
  setQuote as setQuoteAPI,
  deleteQuote as deleteQuoteAPI,
  getShortBook,
  Quote,
  ShortBook,
} from '~/common/api/firebaseAPI'
import { loading, loaded } from '~/features/loader/loaderSlice'
import { redirect } from '~/features/location/locationSlice'
import { success, error } from '~/features/notification/notificationSlice'
import { quotesRoute } from './Routes'

interface QuotesState {
  quotes: Quote[]
  quote?: Quote
  shortBook?: ShortBook
  filterByUser: boolean
}

const thunkPrefix = 'quotes'

export const fetchShortBook = createAsyncThunk(
  `${thunkPrefix}/getShortBook`,
  async (bookId: string, { dispatch }) => {
    try {
      dispatch(loading())
      return await getShortBook(bookId)
    } finally {
      dispatch(loaded())
    }
  }
)

export const deleteQuote = createAsyncThunk(
  `${thunkPrefix}/deleteQuote`,
  async (
    args: { bookId: string; quoteId: string; userId?: string },
    { dispatch }
  ) => {
    try {
      dispatch(loading())
      await deleteQuoteAPI(args.bookId, args.quoteId)
      dispatch(success('Цитата удалена'))
      dispatch(
        fetchQuotes({
          bookId: args.bookId,
          userId: args.userId,
          reset: true,
        })
      )
    } catch (e) {
      dispatch(error('Не удалось удалить цитату'))
    } finally {
      dispatch(loaded())
    }
  }
)

export const setQuote = createAsyncThunk(
  `${thunkPrefix}/setQuote`,
  async (args: { quote: Quote; bookId: string }, { dispatch }) => {
    const { quote, bookId } = args
    try {
      dispatch(loading())
      await setQuoteAPI(bookId, quote)
      dispatch(success(`Цитата ${quote.id ? 'обновлена' : 'добавлена'}`))
      dispatch(redirect(quotesRoute(bookId)))
    } catch (e) {
      dispatch(error(`Не удалось ${quote.id ? 'обновить' : 'добавить'} цитату`))
    } finally {
      dispatch(loaded())
    }
  }
)

export const fetchQuote = createAsyncThunk(
  `${thunkPrefix}/fetchQuote`,
  async (args: { bookId: string; quoteId: string }, { dispatch }) => {
    try {
      dispatch(loading())
      return await getQuote(args.bookId, args.quoteId)
    } finally {
      dispatch(loaded())
    }
  }
)

export const fetchQuotes = createAsyncThunk(
  `${thunkPrefix}/fetchQuotes`,
  async (
    args: { bookId: string; userId?: string; lastId?: string; reset?: boolean },
    { dispatch, getState }
  ) => {
    try {
      dispatch(loading())

      const {
        quotes: { filterByUser },
      } = getState() as RootState

      const quotes = await getQuotes({
        ...args,
        userId: filterByUser ? args.userId : void 0,
      })

      return { quotes, reset: args.reset }
    } finally {
      dispatch(loaded())
    }
  }
)

const initialState: QuotesState = {
  quotes: [],
  filterByUser: true,
}

const quotesSlice = createSlice({
  name: 'quotes',
  initialState,
  reducers: {
    resetQuotes(state) {
      state.quotes = []
      state.shortBook = void 0
    },
    resetQuote(state) {
      state.quote = void 0
    },
    toggleFilterByUser(state) {
      state.filterByUser = !state.filterByUser
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

    builder.addCase(fetchShortBook.fulfilled, (state, action) => {
      state.shortBook = action.payload
    })
  },
})

export const {
  resetQuotes,
  resetQuote,
  toggleFilterByUser,
} = quotesSlice.actions

export default quotesSlice.reducer
