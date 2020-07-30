import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface NotificationState {
  message: string
  type?: Severity
}

type Severity = 'success' | 'info' | 'warning' | 'error'

const initialState: NotificationState = {
  message: '',
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    success(state, action: PayloadAction<string>) {
      state.message = action.payload
      state.type = 'success'
    },
    error(state, action: PayloadAction<string>) {
      state.message = action.payload
      state.type = 'error'
    },
    reset(state) {
      state.message = ''
      state.type = void 0
    },
  },
})

export const { success, error, reset } = notificationSlice.actions

export default notificationSlice.reducer
