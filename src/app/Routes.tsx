import React from 'react'
import { Switch } from 'react-router-dom'
import BookDetailsRoutes from '~/features/bookDetails/Routes'
import BookListRoutes from '~/features/bookList/Routes'
import QuotesRoutes from '~/features/quotes/Routes'

const Routes = () => (
  <Switch>
    {BookListRoutes}
    {BookDetailsRoutes}
    {QuotesRoutes}
  </Switch>
)

export default Routes
