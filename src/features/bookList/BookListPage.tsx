import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'
import { useWillUnmount } from 'beautiful-react-hooks'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/app/rootReducer'
import { ShortItemList, Author, ListItemType } from '~/common/api/firebaseAPI'
import coverPlaceholderImage from '~/common/assets/book_cover.svg'
import MoreButton from '~/common/components/MoreButtn'
import { humanDate } from '~/common/utils/date'
import { redirect } from '~/features/location/locationSlice'
import BookFilters from './BookFilters'
import { fetchUserBooks, resetShortItemList } from './bookListSlice'

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
  }),
  { name: 'BookListPage' }
)

const BookListPage = () => {
  const [type, setType] = useState<ListItemType>()
  const classes = useStyles()
  const dispatch = useDispatch()
  const { user, shortItemList, loading } = useSelector((store: RootState) => ({
    user: store.user.user,
    shortItemList: store.bookList.shortItemList,
    loading: store.loader.loading,
  }))

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
    dispatch(redirect(`/book/${listId}`))
  }

  const handleChangeBookType = (value: ListItemType) => {
    const nextType = value === type ? void 0 : value
    fetchBooks({ type: nextType, reset: true })
    setType(nextType)
  }

  return (
    <div>
      <Box className={classes.headerContainer}>
        <BookFilters
          type={type}
          loading={loading}
          onChangeType={handleChangeBookType}
        />
        <IconButton
          color="primary"
          component="span"
          onClick={handleClickBook()}
          disabled={loading}
        >
          <AddIcon />
        </IconButton>
      </Box>
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
      {shortItemList.length > 0 && <MoreButton onClick={handleLoadMore} />}
    </div>
  )
}

export default BookListPage
