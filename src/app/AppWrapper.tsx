import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import React, { Fragment } from 'react'
import Header from '~/common/components/Header'
import Routes from './Routes'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      paddingBottom: theme.spacing(3),
    },
  })

type Props = WithStyles<typeof styles>

const AppWrapper = ({ classes }: Props) => (
  <Fragment>
    <CssBaseline />
    <Container maxWidth="md" className={classes.root}>
      <Header />
      <Routes />
    </Container>
  </Fragment>
)

export default withStyles(styles)(AppWrapper)
