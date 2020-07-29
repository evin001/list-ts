import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { signInByEmail, User } from '~/common/api/firebaseAPI'

interface SignInByEmail {
  email: string
  password: string
}

type UserState = {
  singInByEmail?: SignInByEmail
  user?: User
}

const initialState: UserState = {}

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (signIn: SignInByEmail) => {
    return await signInByEmail(signIn.email, signIn.password)
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload
    })
  },
})

export default userSlice.reducer
