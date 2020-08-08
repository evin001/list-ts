import { Theme } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { AsyncThunkAction } from '@reduxjs/toolkit'
import ruLocale from 'date-fns/locale/ru'
import debounce from 'lodash/debounce'
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { useParams } from 'react-router-dom'
import { RootState } from '~/app/rootReducer'
import {
  Author,
  Genre,
  Tag,
  Series,
  ListItemType,
  listItemTypes,
} from '~/common/api/firebaseAPI'
import coverPlaceholderImage from '~/common/assets/book_cover.svg'
import EditButtonGroup from '~/common/components/EditButtonGroup'
import { RuLocalizedUtils } from '~/common/utils/date'
import { redirect } from '~/features/location/locationSlice'
import BookDetailsForm, {
  BookDetailsType,
  BookType,
  AutocompleteBookType,
} from './BookDetailsForm'
import {
  fetchBook,
  findAuthors,
  findGenres,
  findTags,
  findSeries,
  findBooks,
  selectBookNames,
  setBookList,
} from './bookDetailsSlice'

const COVER_SIZE_LIMIT = 512 // Kilobytes

const useStyles = makeStyles(
  (theme: Theme) => ({
    datePickerBox: {
      margin: `${theme.spacing(2)}px 0 ${theme.spacing(1)}px`,
      '& > div': {
        width: '100%',
      },
    },
    cover: {
      marginLeft: theme.spacing(3),
      textAlign: 'center',
      '& input': {
        display: 'none',
      },
    },
    coverImage: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
      width: '160px',
      height: '230px',
      padding: '3px',
      marginBottom: theme.spacing(1),
      '& img': {
        width: '100%',
        height: 'auto',
        maxHeight: '100%',
      },
    },
    row: {
      display: 'flex',
    },
    yearAndEdition: {
      display: 'flex',
      '& > :first-child': {
        marginRight: theme.spacing(2),
      },
    },
  }),
  { name: 'BookDetailsPage' }
)

const BookDetailsPage = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { id } = useParams()
  const {
    user,
    listItem,
    filteredGenres,
    filteredTags,
    filteredSeries,
    filteredAuthors,
    filteredBooks,
    filteredBookNames,
  } = useSelector(
    (store: RootState) => ({
      user: store.user.user,
      listItem: store.bookDetails.listItem,
      filteredAuthors: store.bookDetails.filteredAuthors,
      filteredGenres: store.bookDetails.filteredGenres,
      filteredTags: store.bookDetails.filteredTags,
      filteredSeries: store.bookDetails.filteredSeries,
      filteredBooks: store.bookDetails.filteredBooks,
      filteredBookNames: selectBookNames(store.bookDetails),
    }),
    shallowEqual
  )

  const [details, setDetails] = useState<BookDetailsForm>(new BookDetailsForm())
  const [cover, setCover] = useState<File | null>(null)
  const imagePreview = useRef<HTMLImageElement>(null)
  const coverInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (id && user) {
      dispatch(fetchBook({ listId: id, userId: user.id }))
    }
  }, [user])

  useEffect(() => {
    if (listItem) {
      setDetails(new BookDetailsForm(listItem))
    }
  }, [listItem])

  const updateDetails = (modifier: (details: BookDetailsForm) => void) => {
    const nextDetails = details.clone()
    modifier(nextDetails)
    setDetails(nextDetails)
  }

  const handleChangeBook = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateDetails(
      (details) =>
        (details.book[event.target.id as BookType] = event.target.value)
    )
  }

  const handleChangeListItem = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateDetails(
      (details) =>
        (details[event.target.id as BookDetailsType] = event.target.value)
    )
  }

  const handleChangeType = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    updateDetails(
      (details) => (details.type = event.target.value as ListItemType)
    )
  }

  const handleChangeDate = (date: Date | null) => {
    updateDetails((details) => (details.doneDate = date ?? void 0))
  }

  const handleChangeWithoutDate = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateDetails((details) => (details.withoutDate = event.target.checked))
  }

  function handleChangeAutocomplete(field: AutocompleteBookType) {
    return (event: React.ChangeEvent<unknown>, value: (string | any)[]) => {
      updateDetails((details) => (details.book[field] = value))
    }
  }

  const handleChangeAutocompleteInput = (
    action: (args: string) => AsyncThunkAction<any, any, any>
  ) =>
    debounce((event: React.ChangeEvent<unknown>, value: string) => {
      if (value) {
        dispatch(action(value))
      }
    }, 300)

  const handleChangeBookName = (
    event: React.ChangeEvent<unknown>,
    value: string | null
  ) => {
    updateDetails((details) => {
      details.book.name = value || ''
      const filteredBookIndex = filteredBooks.findIndex((b) => b.name === value)
      if (value && ~filteredBookIndex) {
        details.book.id = filteredBooks[filteredBookIndex].id
        details.book.description = filteredBooks[filteredBookIndex].description
        details.book.cover = filteredBooks[filteredBookIndex].cover
      }
    })
  }

  const handleChangeBookNameInput = debounce(
    (event: React.ChangeEvent<unknown>, value: string) => {
      handleChangeBookName(event, value)
      if (value && details.book.authors.length) {
        dispatch(
          findBooks({
            needle: value,
            authors: details.book.authors.map((a) => a as Author),
          })
        )
      }
    },
    300
  )

  const handleCancel = () => dispatch(redirect('/'))

  const resetCover = () => {
    if (coverInput.current) {
      coverInput.current.value = ''
    }
  }

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0]
      if (!file) return resetCover()

      const sizeKb = file.size / 1024
      if (sizeKb > COVER_SIZE_LIMIT) {
        alert(`Максимальный размер файла ${COVER_SIZE_LIMIT} Кб`)
        return resetCover()
      }

      setCover(file)

      if (imagePreview.current) {
        const reader = new FileReader()
        reader.onload = (function (aImg: HTMLImageElement) {
          return function (e: ProgressEvent<FileReader>) {
            if (e.target) {
              aImg.src = e.target.result as string
            }
          }
        })(imagePreview.current)
        reader.readAsDataURL(file)
      }
    }
  }

  const handleSave = () => {
    if (user) {
      dispatch(
        setBookList({
          userId: user.id,
          listItem: details.toObject(),
          cover,
        })
      )
    }
  }

  return (
    <div>
      <Box>
        <TextField
          id="readingTarget"
          label="Цель прочтения"
          fullWidth
          margin="normal"
          value={details.readingTarget}
          helperText={details.helperTextReadingTarget}
          onChange={handleChangeListItem}
        />
      </Box>
      <Box className={classes.yearAndEdition}>
        <TextField
          id="year"
          label="Год"
          margin="normal"
          required
          fullWidth
          type="number"
          value={details.book.year}
          onChange={handleChangeBook}
        />
        <TextField
          id="edition"
          label="Издание"
          margin="normal"
          fullWidth
          value={details.book.edition}
          onChange={handleChangeBook}
          helperText={details.book.helpTextEdition}
        />
      </Box>
      <Box>
        <Autocomplete
          renderInput={(params) => (
            <TextField
              {...params}
              label="Жанры"
              required
              margin="normal"
              helperText={details.book.helpTextGenres}
            />
          )}
          options={filteredGenres}
          getOptionLabel={(option: Genre) => option.name}
          value={details.book.genres}
          getOptionSelected={(option, value) => option.id === value.id}
          onChange={handleChangeAutocomplete('genres')}
          onInputChange={handleChangeAutocompleteInput(findGenres)}
          multiple
          freeSolo
        />
      </Box>
      <Box>
        <Autocomplete
          renderInput={(params) => (
            <TextField
              {...params}
              label="Теги"
              margin="normal"
              helperText={details.book.helpTextTags}
            />
          )}
          options={filteredTags}
          getOptionLabel={(option: Tag) => option.name}
          value={details.book.tags}
          getOptionSelected={(option, value) => option.id === value.id}
          onChange={handleChangeAutocomplete('tags')}
          onInputChange={handleChangeAutocompleteInput(findTags)}
          multiple
          freeSolo
        />
      </Box>
      <Box>
        <Autocomplete
          renderInput={(params) => (
            <TextField
              {...params}
              label="Серия"
              margin="normal"
              helperText={details.book.helpTextSeries}
            />
          )}
          options={filteredSeries}
          getOptionLabel={(option: Series) => option.name}
          value={details.book.series}
          getOptionSelected={(option, value) => option.id === value.id}
          onChange={handleChangeAutocomplete('series')}
          onInputChange={handleChangeAutocompleteInput(findSeries)}
          multiple
          freeSolo
        />
        <TextField
          id="numberInSeries"
          label="Номер в серии"
          margin="normal"
          fullWidth
          type="number"
          value={details.book.numberInSeries}
          onChange={handleChangeBook}
        />
      </Box>
      <Box>
        <Autocomplete
          renderInput={(params) => (
            <TextField
              {...params}
              label="Авторы"
              required
              margin="normal"
              helperText={details.book.helpTextAuthors}
            />
          )}
          options={filteredAuthors}
          getOptionLabel={(option: Author) => option.name}
          value={details.book.authors}
          getOptionSelected={(option, value) => option.id === value.id}
          onChange={handleChangeAutocomplete('authors')}
          onInputChange={handleChangeAutocompleteInput(findAuthors)}
          multiple
          freeSolo
        />
      </Box>
      <Box>
        <Autocomplete
          renderInput={(params) => (
            <TextField
              {...params}
              id="name"
              label="Название"
              required
              fullWidth
              margin="normal"
              helperText={details.book.helperTextName}
            />
          )}
          options={filteredBookNames}
          value={details.book.name}
          onChange={handleChangeBookName}
          onInputChange={handleChangeBookNameInput}
          freeSolo
        />
      </Box>
      <Box className={classes.row}>
        <TextField
          id="description"
          label="Описание"
          required
          fullWidth
          multiline
          rowsMax={10}
          margin="normal"
          value={details.book.description}
          helperText={details.book.helpTextDescription}
          onChange={handleChangeBook}
        />
        <Box className={classes.cover}>
          <Paper className={classes.coverImage}>
            <img
              ref={imagePreview}
              src={details.book.cover || coverPlaceholderImage}
              alt="Обложка"
            />
          </Paper>
          <input
            ref={coverInput}
            accept=".jpg, .jpeg, .png"
            className={classes.cover}
            id="contained-cover-file"
            type="file"
            onChange={handleChangeFile}
          />
          <label htmlFor="contained-cover-file">
            <Button variant="contained" color="primary" component="span">
              Обложка
            </Button>
          </label>
        </Box>
      </Box>
      {details.type === ListItemType.Done && (
        <React.Fragment>
          <Box className={classes.datePickerBox}>
            <MuiPickersUtilsProvider utils={RuLocalizedUtils} locale={ruLocale}>
              <DatePicker
                value={details.doneDate}
                onChange={handleChangeDate}
                disabled={details.withoutDate}
                format="d MMM yyyy"
                cancelLabel="отмена"
                margin="normal"
                disableFuture
              />
            </MuiPickersUtilsProvider>
          </Box>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={details.withoutDate}
                  onChange={handleChangeWithoutDate}
                />
              }
              label="Не помню дату"
            />
          </Box>
        </React.Fragment>
      )}
      <Box>
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="list-type">Список</InputLabel>
          <Select
            inputProps={{ id: 'list-type', name: 'type' }}
            value={details.type}
            onChange={handleChangeType}
          >
            {listItemTypes.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <EditButtonGroup
        id={id}
        disabled={details.hasError}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </div>
  )
}

export default BookDetailsPage
