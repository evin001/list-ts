import { Theme } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { useDidMount } from 'beautiful-react-hooks'
import ruLocale from 'date-fns/locale/ru'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { useParams } from 'react-router-dom'
import { RootState } from '~/app/rootReducer'
import { Author, ListItemType } from '~/common/api/firebaseAPI'
import { RuLocalizedUtils } from '~/common/utils/date'
import BookDetailsForm, { BookDetailsType, BookType } from './BookDetailsForm'
import { fetchBook, findAuthors } from './bookDetailsSlice'
import { listItemTypes } from './constants'

const useStyles = makeStyles(
  (theme: Theme) => ({
    footer: {
      marginTop: theme.spacing(2),
    },
    buttonDivider: {
      display: 'inline-block',
      width: theme.spacing(2),
    },
    datePickerBox: {
      margin: `${theme.spacing(2)}px 0 ${theme.spacing(1)}px`,
      '& > div': {
        width: '100%',
      },
    },
  }),
  { name: 'BookDetailsPage' }
)

const BookDetailsPage = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { id } = useParams()
  const { listItem, filteredAuthors } = useSelector(
    (state: RootState) => ({
      listItem: state.bookDetails.listItem,
      filteredAuthors: state.bookDetails.filteredAuthors,
    }),
    shallowEqual
  )

  const [details, setDetails] = useState<BookDetailsForm>(new BookDetailsForm())

  useDidMount(() => {
    if (id) {
      dispatch(fetchBook(id))
    }
  })

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

  const handleChangeAuthor = (
    event: React.ChangeEvent<unknown>,
    value: (string | Author)[]
  ) => {
    updateDetails((details) => (details.book.authors = value))
  }

  const handleChangeAuthorInput = (
    event: React.ChangeEvent<unknown>,
    value: string
  ) => {
    if (value) {
      dispatch(findAuthors(value))
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
      <Box>
        <Autocomplete
          renderInput={(params) => (
            <TextField {...params} label="Автор" required margin="normal" />
          )}
          options={filteredAuthors}
          getOptionLabel={(option: Author) => option.name}
          value={details.book.authors}
          getOptionSelected={(option, value) => option.id === value.id}
          onChange={handleChangeAuthor}
          onInputChange={handleChangeAuthorInput}
          multiple
          freeSolo
        />
      </Box>
      <Box>
        <TextField
          id="name"
          label="Название"
          required
          fullWidth
          margin="normal"
          value={details.book.name}
          error={details.book.errorName}
          helperText={details.book.helperTextName}
          onChange={handleChangeBook}
        />
      </Box>
      <Box>
        <TextField
          id="description"
          label="Описание"
          required
          fullWidth
          multiline
          rowsMax={10}
          margin="normal"
          value={details.book.description}
          error={details.book.errorDescription}
          helperText={details.book.helpTextDescription}
          onChange={handleChangeBook}
        />
      </Box>
      <Box>
        <TextField type="file" label="Обложка" fullWidth margin="normal" />
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
      <Box className={classes.footer}>
        <Button>Отменить</Button>
        <div className={classes.buttonDivider} />
        <Button variant="contained" color="primary">
          {id ? 'Обновить' : 'Отменить'}
        </Button>
      </Box>
    </div>
  )
}

export default BookDetailsPage
