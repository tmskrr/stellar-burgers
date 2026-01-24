import { createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '../utils/burger-api';
import { TOrder } from '@utils-types';
import { AppDispatch } from '../services/store';

type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    profileOrdersRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    profileOrdersSuccess: (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    },
    profileOrdersFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    }
  }
});

export const {
  profileOrdersRequest,
  profileOrdersSuccess,
  profileOrdersFailed
} = profileOrdersSlice.actions;

export const fetchProfileOrders = () => (dispatch: AppDispatch) => {
  dispatch(profileOrdersRequest());

  getOrdersApi()
    .then((orders) => {
      dispatch(profileOrdersSuccess(orders));
    })
    .catch((err) => {
      dispatch(profileOrdersFailed(err?.message || 'Ошибка загрузки заказов'));
    });
};

export default profileOrdersSlice.reducer;
