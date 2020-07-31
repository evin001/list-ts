import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import Grid from '@material-ui/core/Grid'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/app/rootReducer'
import { ShortItemList, Author } from '~/common/api/firebaseAPI'
import coverPlaceholderImage from '~/common/assets/book_cover.svg'
import { fetchUserBooks } from './bookListSlice'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      paddingTop: theme.spacing(4),
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

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        {shortItemList.map((item: ShortItemList) => (
          <Grid item xs={4} key={item.id}>
            <Card>
              {/*<CardHeader
                disableTypography
                title={
                  <Typography variant="body2">{item.shortBook.name}</Typography>
                }
                subheader={
                  <Typography variant="body2" color="textSecondary">
                    {item.shortBook.authors
                      .map((item: Author) => item.name)
                      .join(', ')}
                  </Typography>
                }
              />*/}
              <CardMedia
                className={classes.media}
                image={item.shortBook.cover || coverPlaceholderImage}
                title={item.shortBook.name}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default BookListPage
