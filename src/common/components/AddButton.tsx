import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '~/app/rootReducer'

type Props = { onClick: () => void }

const AddButton = ({ onClick }: Props) => {
  const { loading } = useSelector((store: RootState) => ({
    loading: store.loader.loading,
  }))
  return (
    <IconButton
      color="primary"
      component="span"
      onClick={onClick}
      disabled={loading}
    >
      <AddIcon />
    </IconButton>
  )
}

export default AddButton
