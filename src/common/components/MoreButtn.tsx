import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { pink } from '@material-ui/core/colors'
import { makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '~/app/rootReducer'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      position: 'relative',
      textAlign: 'center',
      marginTop: theme.spacing(3),
    },
    buttonProgress: {
      color: pink[500],
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  }),
  { name: 'MoreButton' }
)

type Props = {
  onClick?: () => void
}

const MoreButton = ({ onClick }: Props) => {
  const classes = useStyles()
  const { loading } = useSelector((store: RootState) => ({
    loading: store.loader.loading,
  }))
  return (
    <Box className={classes.root}>
      <Button
        variant="contained"
        color="primary"
        onClick={onClick}
        disabled={loading}
      >
        Загрузить ещё
      </Button>
      {loading && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </Box>
  )
}

export default MoreButton
