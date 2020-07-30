import {
  createSlice,
  createAsyncThunk,
  createSelector,
  ActionCreatorWithPreparedPayload,
} from '@reduxjs/toolkit'
import {
  getBookFromList,
  searchAuthors,
  searchBooks,
  searchGenres,
  searchTags,
  setBookList as setBookListAPI,
  ListItem,
  Author,
  Genre,
  Tag,
  FilteredBook,
} from '~/common/api/firebaseAPI'
import { loading, loaded } from '~/features/loader/loaderSlice'
import { redirect } from '~/features/location/locationSlice'
import { success, error } from '~/features/notification/notificationSlice'

interface BookDetailsState {
  listItem?: ListItem
  filteredAuthors: Author[]
  filteredGenres: Genre[]
  filteredTags: Tag[]
  filteredBooks: FilteredBook[]
}

const initialState: BookDetailsState = {
  listItem: undefined,
  filteredAuthors: [],
  filteredGenres: [],
  filteredTags: [],
  filteredBooks: [],
}

const thunkPrefix = 'bookDetails'

export const fetchBook = createAsyncThunk(
  `${thunkPrefix}/fetchBook`,
  async (listId: string, { dispatch }) => {
    try {
      dispatch(loading())
      return await getBookFromList(listId)
    } catch (e) {
      dispatch(error('Не удалось загрузить данные'))
    } finally {
      dispatch(loaded())
    }
  }
)

export const findAuthors = createAsyncThunk(
  `${thunkPrefix}/findAuthors`,
  async (needle: string) => {
    return await searchAuthors(needle)
  }
)

export const findGenres = createAsyncThunk(
  `${thunkPrefix}/findGenres`,
  async (needle: string) => {
    return await searchGenres(needle)
  }
)

export const findTags = createAsyncThunk(
  `${thunkPrefix}/findTags`,
  async (needle: string) => {
    return await searchTags(needle)
  }
)

export const findBooks = createAsyncThunk(
  `${thunkPrefix}/findBooks`,
  async (args: { needle: string; authors: Author[] }) => {
    return await searchBooks(args.needle, args.authors)
  }
)

export const setBookList = createAsyncThunk(
  `${thunkPrefix}/setBookList`,
  async (listItem: ListItem, { dispatch }) => {
    try {
      dispatch(loading())
      await setBookListAPI(listItem)
      dispatch(success(listItem.id ? 'Книга обновлена' : 'Книга добавлена'))
      dispatch(redirect('/'))
    } catch (e) {
      dispatch(error('Не удалось обновить книгу'))
    } finally {
      dispatch(loaded())
    }
  }
)

const bookDetailsSlice = createSlice({
  name: 'bookDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    function setField(
      method: ActionCreatorWithPreparedPayload<any, any>,
      field: keyof BookDetailsState
    ) {
      builder.addCase(method, (state, action) => {
        state[field] = action.payload
      })
    }

    function errorStub(method: ActionCreatorWithPreparedPayload<any, any>) {
      builder.addCase(method, (state, action) => {
        console.log({ action })
      })
    }

    setField(fetchBook.fulfilled, 'listItem')
    setField(findAuthors.fulfilled, 'filteredAuthors')
    setField(findGenres.fulfilled, 'filteredGenres')
    setField(findTags.fulfilled, 'filteredTags')
    setField(findBooks.fulfilled, 'filteredBooks')

    errorStub(setBookList.rejected)

    builder.addCase(fetchBook.rejected, (state, action) => {
      // TODO Redirect to not found page
      console.log({ action })
    })
  },
})

export const getFilteredBooks = (state: BookDetailsState) => state.filteredBooks
export const selectBookNames = createSelector(getFilteredBooks, (books) =>
  books.map((book) => book.name)
)

export default bookDetailsSlice.reducer
