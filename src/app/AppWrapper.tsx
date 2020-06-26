import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import { useDidMount } from 'beautiful-react-hooks'
import React, { Fragment } from 'react'
import { useDispatch } from 'react-redux'
import Header from '~/common/components/Header'
import LinearProgress from '~/common/components/LinearProgress'
import { fetchUser } from '~/features/user/userSlice'
import Routes from './Routes'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      paddingBottom: theme.spacing(3),
    },
  })

type Props = WithStyles<typeof styles>

const AppWrapper = ({ classes }: Props) => {
  const dispatch = useDispatch()

  useDidMount(() => {
    dispatch(fetchUser({ email: 'e19a@yandex.ru', password: '123456' }))
  })

  return (
    <Fragment>
      <CssBaseline />
      <Container maxWidth="md" className={classes.root}>
        <Header />
        <LinearProgress />
        <Routes />
      </Container>
    </Fragment>
  )
}

export default withStyles(styles)(AppWrapper)
