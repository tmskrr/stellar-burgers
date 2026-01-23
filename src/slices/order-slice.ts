import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../utils/burger-api';
import { AppDispatch } from '../services/store';
import { TOrder } from '../utils/types';
import { clearConstructor } from './constructor-slice';

type TOrderState = {
  orderRequest: boolean;
  orderError: string | null;
  orderModalData: TOrder | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderError: null,
  orderModalData: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    orderRequest: (state) => {
      state.orderRequest = true;
      state.orderError = null;
    },
    orderSuccess: (state, action: PayloadAction<TOrder>) => {
      state.orderRequest = false;
      state.orderModalData = action.payload;
    },
    orderFailed: (state, action: PayloadAction<string>) => {
      state.orderRequest = false;
      state.orderError = action.payload;
    },
    closeOrderModal: (state) => {
      state.orderModalData = null;
    }
  }
});

export const { orderRequest, orderSuccess, orderFailed, closeOrderModal } =
  orderSlice.actions;

export const createOrder =
  (ingredients: string[]) => (dispatch: AppDispatch) => {
    dispatch(orderRequest());

    orderBurgerApi(ingredients)
      .then((res) => {
        dispatch(orderSuccess(res.order));
        dispatch(clearConstructor());
      })
      .catch((err) => {
        dispatch(orderFailed(err?.message || 'Ошибка оформления заказа'));
      });
  };

export default orderSlice.reducer;
