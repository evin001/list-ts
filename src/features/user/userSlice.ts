import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from '~/app/store'
import { signInByEmail } from '~/common/api/firebaseAPI'

interface User {
  email: string
  password: string
}

type UserState = {
  user: User
}

const initialState: UserState = {
  user: {
    email: '',
    password: '',
  },
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signIn(state, action: PayloadAction<User>) {},
  },
})

export const { signIn } = userSlice.actions

export default userSlice.reducer

export const fetchUser = (user: User): AppThunk => async (dispatch) => {
  try {
    await signInByEmail(user.email, user.password)
  } catch (err) {
    console.log(err)
  }
}
