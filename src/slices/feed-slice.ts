import { createSlice } from '@reduxjs/toolkit';
import { getFeedsApi } from '../utils/burger-api';
import { TOrder } from '@utils-types';
import { AppDispatch } from '../services/store';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    feedRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    feedSuccess: (state, action) => {
      state.isLoading = false;
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
    feedFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    }
  }
});

export const { feedRequest, feedSuccess, feedFailed } = feedSlice.actions;

export const fetchFeed = () => (dispatch: AppDispatch) => {
  dispatch(feedRequest());

  getFeedsApi()
    .then((data) => {
      dispatch(feedSuccess(data));
    })
    .catch((err) => {
      dispatch(feedFailed(err?.message || 'Ошибка загрузки ленты'));
    });
};

export default feedSlice.reducer;
