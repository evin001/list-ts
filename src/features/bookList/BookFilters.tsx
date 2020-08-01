import { makeStyles, Theme } from '@material-ui/core'
import Chip from '@material-ui/core/Chip'
import React from 'react'
import { ListItemType, listItemTypes } from '~/common/api/firebaseAPI'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'inline-flex',
      flexFlow: 'wrap',
    },
    chip: {
      margin: theme.spacing(1),
    },
  }),
  { name: 'BookFilters' }
)

type Props = {
  type?: ListItemType
  loading: boolean
  onChangeType: (type: ListItemType) => void
}

const BookFilters = ({ type, loading, onChangeType }: Props) => {
  const classes = useStyles()

  const handleClick = (value: ListItemType) => () => onChangeType(value)

  return (
    <div className={classes.root}>
      {listItemTypes.map((data) => (
        <Chip
          key={data.value}
          label={data.label}
          variant="outlined"
          className={classes.chip}
          color={type === data.value ? 'secondary' : 'default'}
          onClick={handleClick(data.value)}
          disabled={loading}
        />
      ))}
    </div>
  )
}

export default BookFilters
