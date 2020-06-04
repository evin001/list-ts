import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getBookFromList, ListItem } from '~/common/api/firebaseAPI'

interface BookDetailsState {
  listItem?: ListItem
}

const initialState: BookDetailsState = {
  listItem: undefined,
}

export const fetchBook = createAsyncThunk(
  'bookDetails/fetchBook',
  async (listId: string) => {
    return await getBookFromList(listId)
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
  },
})

export default bookDetailsSlice.reducer
