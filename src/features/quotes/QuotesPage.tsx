import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import { makeStyles, Theme } from '@material-ui/core/styles'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import FormatQuoteIcon from '@material-ui/icons/FormatQuote'
import ShareIcon from '@material-ui/icons/Share'
import Alert from '@material-ui/lab/Alert'
import { useWillUnmount } from 'beautiful-react-hooks'
import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { RootState } from '~/app/rootReducer'
import { Quote } from '~/common/api/firebaseAPI'
import AddButton from '~/common/components/AddButton'
import ConfirmDialog from '~/common/components/ConfirmDialog'
import MoreButton from '~/common/components/MoreButtn'
import RowContent from '~/common/components/RowContent'
import { redirect } from '~/features/location/locationSlice'
import { fetchQuotes, resetQuotes } from './quotesSlice'
import { quoteEditRoute, quoteCreateRoute } from './Routes'
import { getColor } from './utils'

type Props = {
  onShare?: () => void
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    card: {
      position: 'relative',
      overflow: 'initial',
      marginTop: theme.spacing(4),
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
      paddingTop: theme.spacing(4),
      paddingBottom: 0,
    },
    actions: {
      justifyContent: 'center',
    },
    headerContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: theme.spacing(1),
    },
    emptyQuotes: {
      marginTop: theme.spacing(1),
    },
  }),
  { name: 'QuotesPage' }
)

const QuotesPage = ({ onShare }: Props) => {
  const classes = useStyles()
  const [deleteId, setDeleteId] = useState<string>()
  const { bookId } = useParams()
  const dispatch = useDispatch()
  const { user, quotes } = useSelector((store: RootState) => ({
    user: store.user.user,
    quotes: store.quotes.quotes,
  }))
  const deleteQuoteIndex = quotes.findIndex(
    (item: Quote) => item.id === deleteId
  )

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchQuotes({ bookId, userId: user.id }))
    }
  }, [user])

  useWillUnmount(() => dispatch(resetQuotes()))

  function loadMore(options: { reset?: boolean } = {}) {
    const lastId = quotes.length ? quotes[quotes.length - 1].id : ''
    dispatch(
      fetchQuotes({ bookId, userId: user?.id, lastId, reset: options.reset })
    )
  }

  const handleLoadMore = () => loadMore({ reset: false })

  const handleClickEdit = (quoteId: string) => () =>
    dispatch(redirect(quoteEditRoute(bookId, quoteId)))

  const handleClickCreate = () => dispatch(redirect(quoteCreateRoute(bookId)))

  const handleClickDelete = (value: string) => () => setDeleteId(value)

  const handleCloseModal = () => setDeleteId('')

  const handleDeleteQuote = () => {
    console.log('delete', deleteId)
    handleCloseModal()
  }

  return (
    <div>
      <Box className={classes.headerContainer}>
        <AddButton onClick={handleClickCreate} />
      </Box>
      {quotes.map((item: Quote, index: number) => {
        const color = getColor(index)
        return (
          <Card className={classes.card} key={item.id}>
            <Paper className={classes.quote} style={{ background: color }}>
              <FormatQuoteIcon />
            </Paper>
            <CardContent className={classes.content}>
              <RowContent text={item.quote} />
            </CardContent>
            <CardActions disableSpacing className={classes.actions}>
              {onShare && (
                <IconButton>
                  <ShareIcon style={{ color }} />
                </IconButton>
              )}
              {user?.id === item.userId && (
                <Fragment>
                  <IconButton onClick={handleClickEdit(item.id)}>
                    <EditIcon style={{ color }} />
                  </IconButton>
                  <IconButton onClick={handleClickDelete(item.id)}>
                    <DeleteIcon style={{ color }} />
                  </IconButton>
                </Fragment>
              )}
            </CardActions>
          </Card>
        )
      })}
      <ConfirmDialog
        title="Вы действительно хотите удалить цитату?"
        open={deleteQuoteIndex !== -1}
        onClose={handleCloseModal}
        onConfirm={handleDeleteQuote}
        agreeText="Удалить"
      >
        {deleteQuoteIndex !== -1 && (
          <RowContent text={quotes[deleteQuoteIndex].quote} />
        )}
      </ConfirmDialog>
      {quotes.length > 0 ? (
        <MoreButton onClick={handleLoadMore} />
      ) : (
        <Alert severity="info" className={classes.emptyQuotes}>
          Нет доступных цитат
        </Alert>
      )}
    </div>
  )
}

export default QuotesPage