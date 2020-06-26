import { createSlice } from '@reduxjs/toolkit'

interface LoaderState {
  loading: boolean
}

const initialState: LoaderState = {
  loading: false,
}

const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    loading(state) {
      state.loading = true
    },
    loaded(state) {
      state.loading = false
    },
  },
})

export const { loading, loaded } = loaderSlice.actions

export default loaderSlice.reducer
