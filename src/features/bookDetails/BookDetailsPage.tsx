import { Theme } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
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
import { RuLocalizedUtils } from '~/common/utils/date'
import { fetchBook } from './bookDetailsSlice'

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

  const [name, setName] = useState<string>('')
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const [description, setDescription] = useState<string>('')
  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value)
  }

  useDidMount(() => {
    if (id) {
      dispatch(fetchBook(id))
    }
  })

  useEffect(() => {
    if (listItem) {
      setName(listItem.book.name)
      setDescription(listItem.book.description)
    }
  }, [listItem])

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
          label="Название"
          required
          fullWidth
          margin="normal"
          value={name}
          onChange={handleChange}
        />
      </Box>
      <Box>
        <TextField
          label="Описание"
          required
          fullWidth
          multiline
          rowsMax={10}
          margin="normal"
          value={description}
          onChange={handleChangeDescription}
        />
      </Box>
      <Box>
        <TextField type="file" label="Обложка" fullWidth margin="normal" />
      </Box>
      <Box className={classes.datePickerBox}>
        <MuiPickersUtilsProvider utils={RuLocalizedUtils} locale={ruLocale}>
          <DatePicker
            value={new Date()}
            onChange={() => {}}
            format="d MMM yyyy"
            cancelLabel="отмена"
            margin="normal"
          />
        </MuiPickersUtilsProvider>
      </Box>
      <Box>
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="list-type">Список</InputLabel>
          <Select inputProps={{ id: 'list-type', name: 'type' }}>
            {[
              { value: 'done', label: 'Прочитанные' },
              { value: 'in-process', label: 'Читаю' },
              { value: 'planned', label: 'Запланированные' },
            ].map((item) => (
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
          Обновить
        </Button>
      </Box>
    </div>
  )
}

export default BookDetailsPage
