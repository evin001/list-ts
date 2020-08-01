import Box from '@material-ui/core/Box'
import Progress from '@material-ui/core/LinearProgress'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '~/app/rootReducer'

const useStyles = makeStyles(
  createStyles({
    progress: {
      position: 'absolute',
      width: '100%',
      height: 2,
    },
  }),
  { name: 'LinearProgress' }
)

const LinearProgress = () => {
  const { loading } = useSelector((store: RootState) => ({
    loading: store.loader.loading,
  }))
  const classes = useStyles()

  if (!loading) return null

  return (
    <Box position="relative">
      <Progress color="secondary" className={classes.progress} />
    </Box>
  )
}

export default LinearProgress
