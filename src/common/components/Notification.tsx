import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '~/app/rootReducer'
import { reset } from '~/features/notification/notificationSlice'

const Notification = () => {
  const dispatch = useDispatch()
  const { message, type } = useSelector((store: RootState) => ({
    message: store.notification.message,
    type: store.notification.type,
  }))

  const handleClose = () => dispatch(reset())

  return (
    <Snackbar
      open={message !== ''}
      onClose={handleClose}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        severity={type}
        elevation={6}
        variant="filled"
        onClose={handleClose}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}

export default Notification
