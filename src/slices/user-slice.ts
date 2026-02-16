import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { TUser } from '../utils/types';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '../utils/burger-api';
import { setCookie } from '../utils/cookie';

type TUserState = {
  user: TUser | null;
  isLoading: boolean;
  isInit: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isLoading: false,
  isInit: false,
  error: null
};

// проверка авторизации при старте приложения
export const checkUserAuth = createAsyncThunk<
  TUser,
  void,
  { rejectValue: string }
>('user/checkAuth', async (_, thunkAPI) => {
  try {
    const res = await getUserApi();
    return res.user;
  } catch {
    return thunkAPI.rejectWithValue('Пользователь не авторизован');
  }
});

// логин
export const loginUser = createAsyncThunk<
  TUser,
  { email: string; password: string },
  { rejectValue: string }
>('user/login', async ({ email, password }, thunkAPI) => {
  try {
    const res = await loginUserApi({ email, password });

    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);

    return res.user;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.message || 'Ошибка авторизации');
  }
});

// регистрация
export const registerUser = createAsyncThunk<
  TUser,
  { name: string; email: string; password: string },
  { rejectValue: string }
>('user/register', async ({ name, email, password }, thunkAPI) => {
  try {
    const res = await registerUserApi({ name, email, password });

    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);

    return res.user;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.message || 'Ошибка регистрации');
  }
});

// обновление профиля
export const updateUser = createAsyncThunk<
  TUser,
  { name: string; email: string; password?: string },
  { rejectValue: string }
>('user/update', async (data, thunkAPI) => {
  try {
    const res = await updateUserApi(data);
    return res.user;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err?.message || 'Ошибка обновления профиля'
    );
  }
});

// логаут
export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  setCookie('accessToken', '');
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // check auth
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInit = true;
        state.user = action.payload;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isLoading = false;
        state.isInit = true;
        state.user = null;
      })

      // login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || null;
      })

      // register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || null;
      })

      // update
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || null;
      })

      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isInit = true;
      });
  }
});

export default userSlice.reducer;
