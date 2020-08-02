import TextField from '@material-ui/core/TextField'
import { useDidMount, useWillUnmount } from 'beautiful-react-hooks'
import React, { useState, useEffect } from 'react'
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
  const { quote } = useSelector((store: RootState) => ({
    quote: store.quotes.quote,
  }))

  useDidMount(() => dispatch(fetchQuote(quoteId)))

  useWillUnmount(() => dispatch(resetQuote()))

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

  const handleSave = () => dispatch(setQuote(form.toObject()))

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
      <EditButtonGroup
        id={quoteId}
        disabled={form.hasError}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </div>
  )
}

export default QuoteEditPage
