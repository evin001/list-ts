import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import { makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '~/app/rootReducer'

type Props = {
  id: string
  disabled: boolean
  onCancel: () => void
  onSave: () => void
}

const useStyles = makeStyles((theme: Theme) => ({
  footer: {
    marginTop: theme.spacing(2),
  },
  buttonDivider: {
    display: 'inline-block',
    width: theme.spacing(2),
  },
}))

const EditButtonGroup = ({ id, disabled, onCancel, onSave }: Props) => {
  const classes = useStyles()
  const { loading } = useSelector((store: RootState) => ({
    loading: store.loader.loading,
  }))

  return (
    <Box className={classes.footer}>
      <Button onClick={onCancel}>Отменить</Button>
      <div className={classes.buttonDivider} />
      <Button
        variant="contained"
        color="primary"
        disabled={disabled || loading}
        onClick={onSave}
      >
        {id ? 'Обновить' : 'Добавить'}
      </Button>
    </Box>
  )
}

export default EditButtonGroup
