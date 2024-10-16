import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from "../services/userService";


const initialState = {
    user: {},
    error: false,
    success: false,
    loading: false,
    message: null,
    moradores: []
}
//função do detalhes do usuarios
export const profile = createAsyncThunk('user/profile', async(user, thunkAPI) => {

    const token = thunkAPI.getState().auth.user.token;
    const data = await userService.profile(user, token);
    return data;
    
});

export const getUserAll = createAsyncThunk('user/all', async(user, thunkAPI) => {

    const token = thunkAPI.getState().auth.user.token;
    const data = await userService.getUserAll(user, token);

    if(data.errors){
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
})

//update detalhes do usuarios
export const updateProfile = createAsyncThunk('user/update', async(user, thunkAPI) => {

    const token = thunkAPI.getState().auth.user.token;
 
    const data = await userService.updateProfile(user, token);

    if (data.errors) {
        return thunkAPI.rejectWithValue(data.errors);
    }

    return data;
   
})

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      resetMessage: (state) => {
        state.message = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(profile.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(profile.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.error = null;
          state.user = action.payload;
        })
        .addCase(getUserAll.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getUserAll.fulfilled, (state, action) => {
            state.loading = false;
            state.moradores = action.payload; 
            state.error = null;
        })
        .addCase(getUserAll.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.moradores = []; 
        })
        .addCase(updateProfile.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateProfile.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.error = null;
          state.user = action.payload;
          state.message = "Usuário atualizado com sucesso!";
        })
        .addCase(updateProfile.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          state.user = null;
        })
    }
  });
  
  export const { resetMessage } = userSlice.actions;
  export default userSlice.reducer;