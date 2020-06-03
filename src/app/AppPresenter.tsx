import { createMuiTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { ThemeProvider } from '@material-ui/styles'
import React from 'react'
import { Provider } from 'react-redux'
import { HashRouter as Router } from 'react-router-dom'
import AppWrapper from './AppWrapper'
import store from './store'

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
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <AppWrapper />
        </Router>
      </ThemeProvider>
    </Provider>
  )
}

export default AppPresenter
