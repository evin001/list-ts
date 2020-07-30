import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import history from '~/common/utils/history'

const initialState = {}

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    redirect(state, action: PayloadAction<string>) {
      history.push(action.payload)
    },
  },
})

export const { redirect } = locationSlice.actions

export default locationSlice.reducer
