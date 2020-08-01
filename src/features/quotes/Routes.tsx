import React from 'react'
import { Route } from 'react-router-dom'
import QuotesPage from './QuotesPage'

export default [
  <Route key="quotes" exact path="/quotes/:bookId" component={QuotesPage} />,
]
