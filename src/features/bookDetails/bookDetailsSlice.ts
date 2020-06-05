import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import {
  getBookFromList,
  searchAuthors,
  searchBooks,
  ListItem,
  Author,
  FilteredBook,
} from '~/common/api/firebaseAPI'

interface BookDetailsState {
  listItem?: ListItem
  filteredAuthors: Author[]
  filteredBooks: FilteredBook[]
}

const initialState: BookDetailsState = {
  listItem: undefined,
  filteredAuthors: [],
  filteredBooks: [],
}

const thunkPrefix = 'bookDetails'

export const fetchBook = createAsyncThunk(
  `${thunkPrefix}/fetchBook`,
  async (listId: string) => {
    return await getBookFromList(listId)
  }
)

export const findAuthors = createAsyncThunk(
  `${thunkPrefix}/findAuthors`,
  async (needle: string) => {
    return await searchAuthors(needle)
  }
)

export const findBooks = createAsyncThunk(
  `${thunkPrefix}/findBooks`,
  async (args: { needle: string; authors: Author[] }) => {
    return await searchBooks(args.needle, args.authors)
  }
)

const bookDetailsSlice = createSlice({
  name: 'bookDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBook.fulfilled, (state, action) => {
      state.listItem = action.payload
    })
    builder.addCase(fetchBook.rejected, (state, action) => {
      console.log({ action })
    })

    builder.addCase(findAuthors.fulfilled, (state, action) => {
      state.filteredAuthors = action.payload
    })
    builder.addCase(findAuthors.rejected, (state, action) => {
      console.log({ action })
    })

    builder.addCase(findBooks.fulfilled, (state, action) => {
      state.filteredBooks = action.payload
    })
    builder.addCase(findBooks.rejected, (state, action) => {
      console.log({ action })
    })
  },
})

export const getFilteredBooks = (state: BookDetailsState) => state.filteredBooks
export const selectBookNames = createSelector(getFilteredBooks, (books) =>
  books.map((book) => book.name)
)

export default bookDetailsSlice.reducer
