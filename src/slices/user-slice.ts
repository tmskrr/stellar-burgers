import { createSlice } from '@reduxjs/toolkit';
import type { TUser } from '../utils/types';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '../utils/burger-api';
import type { AppDispatch } from '../services/store';

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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    userSuccess: (state, action: { payload: TUser }) => {
      state.isLoading = false;
      state.isInit = true;
      state.user = action.payload;
    },
    userFailed: (state, action?: { payload?: string }) => {
      state.isLoading = false;
      state.isInit = true;
      state.user = null;
      state.error = action?.payload || null;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isInit = true;
    }
  }
});

export const { userRequest, userSuccess, userFailed, logoutSuccess } =
  userSlice.actions;

// проверка авторизации при старте приложения
export const checkUserAuth = () => (dispatch: AppDispatch) => {
  dispatch(userRequest());

  getUserApi()
    .then((res) => {
      dispatch(userSuccess(res.user));
    })
    .catch(() => {
      dispatch(userFailed());
    });
};

// логин
export const loginUser =
  (email: string, password: string) => (dispatch: AppDispatch) => {
    dispatch(userRequest());

    loginUserApi({ email, password })
      .then((res) => {
        dispatch(userSuccess(res.user));
      })
      .catch((err) => {
        dispatch(userFailed(err?.message || 'Ошибка авторизации'));
      });
  };

// логаут
export const logoutUser = () => (dispatch: AppDispatch) => {
  logoutApi().finally(() => {
    localStorage.removeItem('refreshToken');
    dispatch(logoutSuccess());
  });
};

export default userSlice.reducer;

export const registerUser =
  (name: string, email: string, password: string) =>
  (dispatch: AppDispatch) => {
    dispatch(userRequest());

    registerUserApi({ name, email, password })
      .then((res) => {
        dispatch(userSuccess(res.user));
      })
      .catch((err) => {
        dispatch(userFailed(err?.message || 'Ошибка регистрации'));
      });
  };

export const updateUser =
  (data: { name: string; email: string; password?: string }) =>
  (dispatch: AppDispatch) => {
    dispatch(userRequest());

    updateUserApi(data)
      .then((res) => {
        dispatch(userSuccess(res.user));
      })
      .catch((err) => {
        dispatch(userFailed(err?.message || 'Ошибка обновления профиля'));
      });
  };
