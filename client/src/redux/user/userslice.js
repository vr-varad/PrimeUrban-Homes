import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    error : null,
    loading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart : (state) => {
            state.loading = true
        },
        signInSuccess : (state, action) => {
            state.user = action.payload
            state.loading = false
            state.error = null
        },
        signInFailure : (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        updateUserStart : (state) => {
            state.loading = true
        },
        updateUserSuccess : (state, action) => {
            state.user = action.payload
            state.loading = false
            state.error = null
        },
        updateUserFailure : (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        deleteUserStart : (state) => {
            state.loading = true
        },
        deleteUserSuccess : (state) => {
            state.user = null
            state.loading = false
        },
        deleteUserFailure : (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        signOutUserStart : (state) => {
            state.loading = true
        },
        signOutUserSuccess : (state) => {
            state.user = null
            state.loading = false
        },
        signOutUserFailure : (state, action) => {
            state.error = action.payload
            state.loading = false
        }
    }
})

export const { signInStart, signInSuccess, signInFailure, updateUserFailure, updateUserStart, updateUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure,signOutUserStart,signOutUserSuccess } = userSlice.actions

export default userSlice.reducer