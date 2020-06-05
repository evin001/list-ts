import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getBookFromList,
  searchAuthors,
  ListItem,
  Author,
} from '~/common/api/firebaseAPI'

interface BookDetailsState {
  listItem?: ListItem
  filteredAuthors: Author[]
}

const initialState: BookDetailsState = {
  listItem: undefined,
  filteredAuthors: [],
}

const thunkPrefix = 'bookDetails'

export const fetchBook = createAsyncThunk(
  `${thunkPrefix}/fetchBook`,
  async (listId: string) => {
    return await getBookFromList(listId)
  }
)

export const findAuthors = createAsyncThunk(
  `${thunkPrefix}/searchAuthors`,
  async (needle: string) => {
    return await searchAuthors(needle)
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
  },
})

export default bookDetailsSlice.reducer
