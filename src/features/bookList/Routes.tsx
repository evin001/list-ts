import React from 'react'
import { Route } from 'react-router-dom'
import BookListPage from './BookListPage'

export default [
  <Route key="bookList" exact path="/" component={BookListPage} />,
]
