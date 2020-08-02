import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import React from 'react'

type Props = {
  open: boolean
  title: string
  children: React.ReactNode
  agreeText?: string
  onClose?: () => void
  onConfirm?: () => void
}

const ConfirmDialog = ({
  open,
  title,
  onClose,
  onConfirm,
  children,
  agreeText = 'Ok',
}: Props) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{children}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          {agreeText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
