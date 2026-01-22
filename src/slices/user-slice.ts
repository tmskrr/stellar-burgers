import { createSlice } from '@reduxjs/toolkit';
import type { TUser } from '../utils/types';
import { getUserApi } from '../utils/burger-api';
import type { AppDispatch } from '../services/store';

type TUserState = {
  user: TUser | null;
  isLoading: boolean;
  isInit: boolean;
};

const initialState: TUserState = {
  user: null,
  isLoading: false,
  isInit: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userRequest: (state) => {
      state.isLoading = true;
    },
    userSuccess: (state, action: { payload: TUser }) => {
      state.isLoading = false;
      state.isInit = true;
      state.user = action.payload;
    },
    userFailed: (state) => {
      state.isLoading = false;
      state.isInit = true;
      state.user = null;
    }
  }
});

export const { userRequest, userSuccess, userFailed } = userSlice.actions;

// thunk проверки авторизации при старте приложения
export const checkUserAuth = () => (dispatch: AppDispatch) => {
  dispatch(userRequest());

  getUserApi()
    .then((res) => {
      // getUserApi возвращает server response, в типах есть { user }
      dispatch(userSuccess(res.user));
    })
    .catch(() => {
      dispatch(userFailed());
    });
};

export default userSlice.reducer;
