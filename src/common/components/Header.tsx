import AppBar from '@material-ui/core/AppBar'
import MenuItem from '@material-ui/core/MenuItem'
import Toolbar from '@material-ui/core/Toolbar'
import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => (
  <AppBar position="static">
    <Toolbar>
      <MenuItem component={Link} to="/">
        Книги
      </MenuItem>
    </Toolbar>
  </AppBar>
)

export default Header
