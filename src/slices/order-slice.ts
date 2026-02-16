import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../utils/burger-api';
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

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/createOrder', async (ingredients, thunkAPI) => {
  try {
    const res = await orderBurgerApi(ingredients);

    thunkAPI.dispatch(clearConstructor());

    return res.order;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.message || 'Ошибка оформления заказа');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.payload || 'Ошибка оформления заказа';
      });
  }
});

export const { closeOrderModal } = orderSlice.actions;
export default orderSlice.reducer;
