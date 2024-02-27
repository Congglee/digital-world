import { createSlice } from '@reduxjs/toolkit'
import { User } from 'src/types/user.type'
import { getAccessTokenFromLS, getProfileFromLS } from 'src/utils/auth'

interface AuthSliceState {
  profile: User | null
  isAuthenticated: boolean
}

const initialState: AuthSliceState = {
  profile: getProfileFromLS(),
  isAuthenticated: Boolean(getAccessTokenFromLS())
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload
    }
  }
})

export const { setAuthenticated, setProfile } = authSlice.actions
