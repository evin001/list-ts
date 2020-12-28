import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Chip from '@material-ui/core/Chip'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Skeleton from '@material-ui/lab/Skeleton'
import { useDidMount } from 'beautiful-react-hooks'
import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { RootState } from '~/app/rootReducer'
import coverPlaceholderImage from '~/common/assets/book_cover.svg'
import RowContent from '~/common/components/RowContent'
import { fetchBookById } from './bookDetailsSlice'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    minHeight: 300,
    marginTop: theme.spacing(2),
  },
  media: {
    width: 210,
    height: 300,
    flexShrink: 0,
    backgroundSize: 'cover',
  },
  content: {
    width: '100%',
  },
  container: {
    marginLeft: -5,
    '& > div:last-child': {
      marginRight: 0,
    },
  },
  tag: {
    margin: 5,
  },
}))

const BookPreviewPage = () => {
  const classes = useStyles()
  const { id } = useParams()
  const dispatch = useDispatch()
  const book = useSelector((store: RootState) =>
    (store.bookDetails.selectedBook || {}).id === id
      ? store.bookDetails.selectedBook
      : undefined
  )

  useDidMount(() => {
    if (id) {
      dispatch(fetchBookById(id))
    }
  })

  return (
    <Card className={classes.root}>
      {book ? (
        <CardMedia
          image={book.cover || coverPlaceholderImage}
          className={classes.media}
          title={book.name}
        />
      ) : (
        <Skeleton variant="rect" className={classes.media} />
      )}
      <CardContent className={classes.content}>
        {book ? (
          <Typography>
            {book.name} ({book.year})
          </Typography>
        ) : (
          <Skeleton animation="wave" height={24} width="60%" />
        )}
        {book ? (
          <Typography variant="subtitle2" color="textSecondary">
            {book.authors.map((author) => author.name).join(', ')}
            {book.series.length > 0 && (
              <Fragment>
                {', '}
                {book.series.map((series) => series.name).join(', ')}
                {book.numberInSeries && ` #${book.numberInSeries}`}
              </Fragment>
            )}
          </Typography>
        ) : (
          <Skeleton animation="wave" height={21} width="30%" />
        )}
        {book ? (
          <Typography variant="subtitle2" color="textPrimary" gutterBottom>
            <RowContent text={book.description} />
          </Typography>
        ) : (
          <Fragment>
            <Skeleton animation="wave" height={20} width="95%" />
            <Skeleton animation="wave" height={20} width="87%" />
            <Skeleton animation="wave" height={20} width="90%" />
            <Skeleton animation="wave" height={20} width="85%" />
            <Skeleton animation="wave" height={20} width="45%" />
          </Fragment>
        )}
        {book && (
          <Typography className={classes.container} component="div">
            {book.genres.map((genre) => (
              <Chip key={genre.id} label={genre.name} className={classes.tag} />
            ))}
          </Typography>
        )}
        {book ? (
          <Typography className={classes.container} component="div">
            {book.tags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                variant="outlined"
                className={classes.tag}
              />
            ))}
          </Typography>
        ) : (
          <div style={{ display: 'flex' }}>
            <Skeleton
              animation="wave"
              height={32}
              width="100px"
              style={{ marginRight: 10 }}
            />
            <Skeleton
              animation="wave"
              height={32}
              width="100px"
              style={{ marginRight: 10 }}
            />
            <Skeleton animation="wave" height={32} width="100px" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default BookPreviewPage
