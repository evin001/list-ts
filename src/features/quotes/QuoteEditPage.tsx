import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import { makeStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import { useDidMount } from 'beautiful-react-hooks'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { RootState } from '~/app/rootReducer'
import { redirect } from '~/features/location/locationSlice'
import QuoteForm from './QuoteForm'
import { fetchQuote } from './quotesSlice'
import { quotesRoute } from './Routes'

const useStyles = makeStyles((theme: Theme) => ({
  footer: {
    marginTop: theme.spacing(2),
  },
  buttonDivider: {
    display: 'inline-block',
    width: theme.spacing(2),
  },
}))

const QuoteEditPage = () => {
  const classes = useStyles()
  const { quoteId, bookId } = useParams()
  const [form, setForm] = useState(new QuoteForm())
  const dispatch = useDispatch()
  const { loading, quote } = useSelector((store: RootState) => ({
    loading: store.loader.loading,
    quote: store.quotes.quote,
  }))

  useDidMount(() => dispatch(fetchQuote(quoteId)))

  useEffect(() => {
    if (quote) {
      setForm(new QuoteForm(quote))
    }
  }, [quote])

  const handleChangeQuote = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextForm = form.clone()
    nextForm.quote = event.target.value
    setForm(nextForm)
  }

  const handleCancel = () => dispatch(redirect(quotesRoute(bookId)))

  const handleSave = () => {}

  return (
    <div>
      <TextField
        id="quote"
        label="Цитата"
        required
        fullWidth
        multiline
        rowsMax={10}
        margin="normal"
        value={form.quote}
        helperText={form.helpTextQuote}
        onChange={handleChangeQuote}
      />
      <Box className={classes.footer}>
        <Button onClick={handleCancel}>Отменить</Button>
        <div className={classes.buttonDivider} />
        <Button
          variant="contained"
          color="primary"
          disabled={form.hasError || loading}
          onClick={handleSave}
        >
          {quoteId ? 'Обновить' : 'Создать'}
        </Button>
      </Box>
    </div>
  )
}

export default QuoteEditPage
