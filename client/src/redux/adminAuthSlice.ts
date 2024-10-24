import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminAuthState {
  isLoggedIn: boolean;
}

const initialState: AdminAuthState = {
  isLoggedIn: !!localStorage.getItem('adminToken'),
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token: string }>) => {
      localStorage.setItem('adminToken', action.payload.token);
      state.isLoggedIn = true;
    },
    logout: (state) => {
      localStorage.removeItem('adminToken');
      state.isLoggedIn = false;
    },
  },
});

export const { loginSuccess, logout } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
