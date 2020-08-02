import TextField from '@material-ui/core/TextField'
import Alert from '@material-ui/lab/Alert'
import { useDidMount, useWillUnmount } from 'beautiful-react-hooks'
import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { RootState } from '~/app/rootReducer'
import EditButtonGroup from '~/common/components/EditButtonGroup'
import { redirect } from '~/features/location/locationSlice'
import QuoteForm from './QuoteForm'
import { fetchQuote, resetQuote, setQuote } from './quotesSlice'
import { quotesRoute } from './Routes'

const QuoteEditPage = () => {
  const { quoteId, bookId } = useParams()
  const [form, setForm] = useState(new QuoteForm())
  const dispatch = useDispatch()
  const { quote, user } = useSelector((store: RootState) => ({
    quote: store.quotes.quote,
    user: store.user.user,
  }))

  useDidMount(() => dispatch(fetchQuote(quoteId)))

  useWillUnmount(() => dispatch(resetQuote()))

  useEffect(() => {
    if (quote) {
      setForm(new QuoteForm(quote))
    } else if (user && form.bookId !== bookId && form.userId !== user.id) {
      const nextForm = form.clone()
      nextForm.bookId = bookId
      nextForm.userId = user.id
      setForm(nextForm)
    }
  }, [quote, user, bookId])

  const handleChangeQuote = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextForm = form.clone()
    nextForm.quote = event.target.value
    setForm(nextForm)
  }

  const handleCancel = () => dispatch(redirect(quotesRoute(bookId)))

  const handleSave = () => dispatch(setQuote(form.toObject()))

  if (user && form.userId && form.userId !== user.id) {
    return (
      <Alert severity="error" style={{ marginTop: 16 }}>
        Можно редактировать только свои цитаты
      </Alert>
    )
  }

  return (
    <Fragment>
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
      <EditButtonGroup
        id={quoteId}
        disabled={form.hasError}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </Fragment>
  )
}

export default QuoteEditPage
