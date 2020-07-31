import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import CircularProgress from '@material-ui/core/CircularProgress'
import { pink } from '@material-ui/core/colors'
import Grid from '@material-ui/core/Grid'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/app/rootReducer'
import { ShortItemList, Author } from '~/common/api/firebaseAPI'
import coverPlaceholderImage from '~/common/assets/book_cover.svg'
import { humanDate } from '~/common/utils/date'
import { redirect } from '~/features/location/locationSlice'
import { fetchUserBooks, resetShortItemList } from './bookListSlice'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      paddingTop: theme.spacing(4),
    },
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
    loadMoreContainer: {
      position: 'relative',
      textAlign: 'center',
      marginTop: theme.spacing(3),
    },
    buttonProgress: {
      color: pink[500],
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -9,
      marginLeft: -9,
    },
  }),
  { name: 'BookListPage' }
)

const BookListPage = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { user, shortItemList, loading } = useSelector((store: RootState) => ({
    user: store.user.user,
    shortItemList: store.bookList.shortItemList,
    loading: store.loader.loading,
  }))

  useEffect(() => {
    dispatch(resetShortItemList())
    fetchBooks()
  }, [user])

  function fetchBooks(lastItemId = '') {
    if (user?.id) {
      dispatch(fetchUserBooks({ userId: user.id, lastItemId }))
    }
  }

  const handleClickBook = (listId: string) => () => {
    dispatch(redirect(`/book/${listId}`))
  }

  const handleLoadMore = () => {
    const lastItemId = shortItemList.length
      ? shortItemList[shortItemList.length - 1].id
      : ''
    fetchBooks(lastItemId)
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        {shortItemList.map((item: ShortItemList) => (
          <Grid item xs={4} key={item.id}>
            <CardActionArea>
              <Card className={classes.card} onClick={handleClickBook(item.id)}>
                <CardMedia
                  className={classes.media}
                  image={item.shortBook.cover || coverPlaceholderImage}
                  title={item.shortBook.name}
                />
              </Card>
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
          </Grid>
        ))}
      </Grid>
      {shortItemList.length > 0 && (
        <Box className={classes.loadMoreContainer}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLoadMore}
            disabled={loading}
          >
            Ещё
          </Button>
          {loading && (
            <CircularProgress size={18} className={classes.buttonProgress} />
          )}
        </Box>
      )}
    </div>
  )
}

export default BookListPage
