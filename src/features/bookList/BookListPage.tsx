import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
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
import { fetchUserBooks } from './bookListSlice'

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
  }),
  { name: 'BookListPage' }
)

const BookListPage = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { user, shortItemList } = useSelector((store: RootState) => ({
    user: store.user.user,
    shortItemList: store.bookList.shortItemList,
  }))

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserBooks({ userId: user.id }))
    }
  }, [user])

  const handleClickBook = (listId: string) => () => {
    dispatch(redirect(`/book/${listId}`))
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
    </div>
  )
}

export default BookListPage
