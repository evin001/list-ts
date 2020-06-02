import { createMuiTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { ThemeProvider } from '@material-ui/styles'
import React from 'react'
import { HashRouter as Router } from 'react-router-dom'
import AppWrapper from './AppWrapper'

const AppPresenter = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  )
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppWrapper />
      </Router>
    </ThemeProvider>
  )
}

export default AppPresenter
