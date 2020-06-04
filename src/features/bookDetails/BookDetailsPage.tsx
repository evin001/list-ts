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
import { ListItemType } from '~/common/api/firebaseAPI'
import { RuLocalizedUtils } from '~/common/utils/date'
import BookDetailsForm, { BookType } from './BookDetailsForm'
import { fetchBook } from './bookDetailsSlice'
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
  const { listItem } = useSelector(
    (state: RootState) => ({
      listItem: state.bookDetails.listItem,
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

  const handleChangeBook = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextDetails = details.clone()
    nextDetails.book[event.target.id as BookType] = event.target.value
    setDetails(nextDetails)
  }

  const handleChangeType = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const nextDetails = details.clone()
    nextDetails.type = event.target.value as ListItemType
    setDetails(nextDetails)
  }

  const handleChangeDate = (date: Date | null) => {
    const nextDetails = details.clone()
    nextDetails.doneDate = date ?? void 0
    setDetails(nextDetails)
  }

  const handleChangeWithoutDate = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextDetails = details.clone()
    nextDetails.withoutDate = event.target.checked
    setDetails(nextDetails)
  }

  return (
    <div>
      <Box>
        <TextField label="Цель прочтения" fullWidth margin="normal" />
      </Box>
      <Box>
        <Autocomplete
          renderInput={(params) => (
            <TextField {...params} label="Автор" required margin="normal" />
          )}
          options={[]}
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
