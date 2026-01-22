import { combineReducers } from '@reduxjs/toolkit';

import ingredientsReducer from '../slices/ingredients-slice';
import userReducer from '../slices/user-slice';
import constructorReducer from '../slices/constructor-slice';
import orderReducer from '../slices/order-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer
});
