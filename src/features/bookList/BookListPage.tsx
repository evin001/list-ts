import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete'
import FormatQuoteIcon from '@material-ui/icons/FormatQuote'
import ShareIcon from '@material-ui/icons/Share'
import Alert from '@material-ui/lab/Alert'
import { useWillUnmount } from 'beautiful-react-hooks'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/app/rootReducer'
import { ShortItemList, Author, ListItemType } from '~/common/api/firebaseAPI'
import coverPlaceholderImage from '~/common/assets/book_cover.svg'
import AddButton from '~/common/components/AddButton'
import ConfirmDialog from '~/common/components/ConfirmDialog'
import MoreButton from '~/common/components/MoreButtn'
import { humanDate } from '~/common/utils/date'
import { redirect } from '~/features/location/locationSlice'
import { quotesRoute } from '~/features/quotes/Routes'
import BookFilters from './BookFilters'
import {
  fetchUserBooks,
  resetShortItemList,
  deleteBookFromList,
} from './bookListSlice'

const useStyles = makeStyles(
  (theme: Theme) => ({
    card: {
      position: 'relative',
    },
    content: {
      position: 'absolute',
      bottom: 0,
      background:
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
      width: '100%',
    },
    media: {
      height: 300,
      backgroundSize: '100%',
    },
    headerContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: `${theme.spacing(1)}px 0`,
    },
    emptyList: {
      marginTop: 30,
    },
    actions: {
      justifyContent: 'center',
    },
  }),
  { name: 'BookListPage' }
)

const BookListPage = () => {
  const [type, setType] = useState<ListItemType>()
  const [deleteId, setDeleteId] = useState<string>()
  const classes = useStyles()
  const dispatch = useDispatch()
  const { user, shortItemList, loading } = useSelector((store: RootState) => ({
    user: store.user.user,
    shortItemList: store.bookList.shortItemList,
    loading: store.loader.loading,
  }))
  const deleteListIndex = useMemo(
    () => shortItemList.findIndex((item) => item.id === deleteId),
    [deleteId]
  )

  useEffect(fetchBooks, [user])

  useWillUnmount(() => dispatch(resetShortItemList()))

  function fetchBooks(options: { type?: ListItemType; reset?: boolean } = {}) {
    if (user?.id) {
      const lastItemId =
        !options.reset && shortItemList.length
          ? shortItemList[shortItemList.length - 1].id
          : ''
      dispatch(
        fetchUserBooks({
          userId: user.id,
          lastItemId,
          type: options.reset ? options.type : type,
          reset: options.reset,
        })
      )
    }
  }

  const handleLoadMore = () => fetchBooks({ reset: false })

  const handleClickBook = (listId = '') => () => {
    dispatch(redirect(`/book/${listId}?type=${type || ''}`))
  }

  const handleChangeBookType = (value: ListItemType) => {
    const nextType = value === type ? void 0 : value
    fetchBooks({ type: nextType, reset: true })
    setType(nextType)
  }

  const linkToQuotes = (bookId: string) => () =>
    dispatch(redirect(quotesRoute(bookId)))

  const handleClickDelete = (bookId: string) => () => setDeleteId(bookId)

  const handleConfirmDelete = () => {
    if (deleteId && user) {
      dispatch(deleteBookFromList({ listId: deleteId, userId: user?.id, type }))
    }
    handleClickDelete('')()
  }

  return (
    <div>
      <Box className={classes.headerContainer}>
        <BookFilters
          type={type}
          loading={loading}
          onChangeType={handleChangeBookType}
        />
        <AddButton onClick={handleClickBook()} />
      </Box>
      <Grid container spacing={4}>
        {shortItemList.map((item: ShortItemList) => (
          <Grid item xs={4} key={item.id}>
            <Card className={classes.card}>
              <CardActionArea onClick={handleClickBook(item.id)}>
                <CardMedia
                  className={classes.media}
                  image={item.shortBook.cover || coverPlaceholderImage}
                  title={item.shortBook.name}
                />
                <CardContent
                  className={classes.content}
                  onClick={handleClickBook(item.id)}
                >
                  <Typography variant="body2">
                    {item.shortBook.name}{' '}
                    {item.doneDate && `(${humanDate(item.doneDate)})`}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {item.shortBook.authors
                      .map((item: Author) => item.name)
                      .join(', ')}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions className={classes.actions}>
                <IconButton onClick={linkToQuotes(item.shortBook.id)}>
                  <FormatQuoteIcon />
                </IconButton>
                <IconButton>
                  <ShareIcon />
                </IconButton>
                <IconButton onClick={handleClickDelete(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {shortItemList.length > 0 ? (
        <MoreButton onClick={handleLoadMore} />
      ) : (
        <Alert severity="info" className={classes.emptyList}>
          Список книг пуст
        </Alert>
      )}
      <ConfirmDialog
        open={deleteListIndex !== -1}
        title="Вы действительно хотите удалить книгу?"
        agreeText="Удалить"
        onClose={handleClickDelete('')}
        onConfirm={handleConfirmDelete}
      >
        Книга {'"'}
        {shortItemList[deleteListIndex]?.shortBook.name}
        {'"'} будет удалена из вашего списка
      </ConfirmDialog>
    </div>
  )
}

export default BookListPage
