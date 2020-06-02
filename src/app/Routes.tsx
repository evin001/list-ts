import React from 'react'
import { Switch, Route } from 'react-router-dom'
import BookDetailsPage from '~/features/bookDetails/BookDetailsPage'
import BookListPage from '~/features/bookList/BookListPage'

const Routes = () => (
  <Switch>
    <Route exact path="/" component={BookListPage} />
    <Route exact path="/book" component={BookDetailsPage} />
  </Switch>
)

export default Routes
