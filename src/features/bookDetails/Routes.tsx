import React from 'react'
import { Route } from 'react-router-dom'
import BookDetailsPage from './BookDetailsPage'

export default [
  <Route
    key="bookDetails-create"
    exact
    path="/book"
    component={BookDetailsPage}
  />,
  <Route
    key="bookDetails-edit"
    exact
    path="/book/:id"
    component={BookDetailsPage}
  />,
]
