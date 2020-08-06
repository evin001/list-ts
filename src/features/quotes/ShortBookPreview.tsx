import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Skeleton from '@material-ui/lab/Skeleton'
import React, { Fragment } from 'react'
import { ShortBook } from '~/common/api/firebaseAPI'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'flex',
      height: 150,
      marginTop: theme.spacing(1),
    },
    media: {
      width: 100,
      height: 150,
      flexShrink: 0,
    },
    content: {
      width: '100%',
    },
  }),
  { name: 'ShortBookPreview' }
)

const ShortBookPreview = ({ book }: { book: ShortBook }) => {
  const classes = useStyles()
  return (
    <Card className={classes.root}>
      {book ? (
        <CardMedia
          image={book.cover}
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
          </Typography>
        ) : (
          <Skeleton animation="wave" height={21} width="30%" />
        )}
        {book ? (
          <Typography variant="subtitle2" color="textPrimary" gutterBottom>
            {book.description.substr(0, 200)} ...
          </Typography>
        ) : (
          <Fragment>
            <Skeleton animation="wave" height={20} width="80%" />
            <Skeleton animation="wave" height={20} width="60%" />
            <Skeleton animation="wave" height={20} width="70%" />
          </Fragment>
        )}
      </CardContent>
    </Card>
  )
}

export default ShortBookPreview
