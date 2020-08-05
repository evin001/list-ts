import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import { useDidMount } from 'beautiful-react-hooks'
import React, { Fragment } from 'react'
import { useDispatch } from 'react-redux'
import Header from '~/common/components/Header'
import LinearProgress from '~/common/components/LinearProgress'
import Notification from '~/common/components/Notification'
import { fetchUser } from '~/features/user/userSlice'
import Routes from './Routes'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      paddingBottom: theme.spacing(3),
      maxWidth: 742,
    },
  })

type Props = WithStyles<typeof styles>

const AppWrapper = ({ classes }: Props) => {
  const dispatch = useDispatch()

  useDidMount(() => {
    dispatch(fetchUser({ email: 'e19a@yandex.ru', password: '123456' }))
    // dispatch(fetchUser({ email: 'evgeniy_p08@mail.ru', password: '123456' }))
  })

  return (
    <Fragment>
      <CssBaseline />
      <Container maxWidth="md" className={classes.root}>
        <Header />
        <LinearProgress />
        <Notification />
        <Routes />
      </Container>
    </Fragment>
  )
}

export default withStyles(styles)(AppWrapper)
