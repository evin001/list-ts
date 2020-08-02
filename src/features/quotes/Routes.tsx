import React from 'react'
import { Route } from 'react-router-dom'
import QuoteEditPage from './QuoteEditPage'
import QuotesPage from './QuotesPage'

export const quotesRoute = (bookId = ':bookId') => `/quotes/${bookId}`
export const quoteEditRoute = (bookId = ':bookId', quoteId = ':quoteId') =>
  `/quote/${bookId}/${quoteId}`
export const quoteCreateRoute = (bookId = ':bookId') => `/quote/${bookId}`

export default [
  <Route key="quotes" exact path={quotesRoute()} component={QuotesPage} />,
  <Route
    key="quote-create"
    exact
    path={quoteCreateRoute()}
    component={QuoteEditPage}
  />,
  <Route
    key="quote-edit"
    exact
    path={quoteEditRoute()}
    component={QuoteEditPage}
  />,
]
