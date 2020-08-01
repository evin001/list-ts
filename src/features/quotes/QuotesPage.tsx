import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { blue } from '@material-ui/core/colors'
import Paper from '@material-ui/core/Paper'
import { makeStyles, Theme } from '@material-ui/core/styles'
import FormatQuoteIcon from '@material-ui/icons/FormatQuote'
import clsx from 'clsx'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { RootState } from '~/app/rootReducer'
import { Quote } from '~/common/api/firebaseAPI'
import { fetchQuotes } from './quotesSlice'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {},
    card: {
      position: 'relative',
      overflow: 'initial',
      marginTop: theme.spacing(4),
    },
    blue: {
      background: blue[500],
    },
    quote: {
      position: 'absolute',
      transform: 'rotate(180deg)',
      borderRadius: '50%',
      fontSize: 36,
      padding: 4,
      top: -18,
      left: 0,
      right: 0,
      margin: 'auto',
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      paddingTop: theme.spacing(3),
    },
  }),
  { name: 'QuotesPage' }
)

const QuotesPage = () => {
  const classes = useStyles()
  const { bookId } = useParams()
  const dispatch = useDispatch()
  const { user, quotes } = useSelector((store: RootState) => ({
    user: store.user.user,
    quotes: store.quotes.quotes,
  }))

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchQuotes({ bookId, userId: user.id }))
    }
  }, [user])

  return (
    <div className={classes.root}>
      {quotes.map((item: Quote) => (
        <Card className={classes.card} key={item.id}>
          <Paper className={clsx(classes.quote, classes.blue)}>
            <FormatQuoteIcon />
          </Paper>
          <CardContent className={classes.content}>{item.quote}</CardContent>
        </Card>
      ))}
    </div>
  )
}

export default QuotesPage
