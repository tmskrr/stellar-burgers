import { createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../utils/burger-api';
import { TIngredient } from '../utils/types';
import { AppDispatch } from '../services/store';

type TIngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  items: [],
  isLoading: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    ingredientsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    ingredientsSuccess: (state, action: { payload: TIngredient[] }) => {
      state.isLoading = false;
      state.items = action.payload;
    },
    ingredientsFailed: (state, action: { payload: string }) => {
      state.isLoading = false;
      state.error = action.payload;
    }
  }
});

export const { ingredientsRequest, ingredientsSuccess, ingredientsFailed } =
  ingredientsSlice.actions;

export const fetchIngredients = () => (dispatch: AppDispatch) => {
  dispatch(ingredientsRequest());

  getIngredientsApi()
    .then((data) => {
      dispatch(ingredientsSuccess(data));
    })
    .catch((err) => {
      dispatch(
        ingredientsFailed(err?.message || 'Ошибка загрузки ингредиентов')
      );
    });
};

export default ingredientsSlice.reducer;
