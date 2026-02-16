import { combineReducers } from '@reduxjs/toolkit';

import ingredientsReducer from '../slices/ingredients-slice';
import userReducer from '../slices/user-slice';
import constructorReducer from '../slices/constructor-slice';
import orderReducer from '../slices/order-slice';
import feedReducer from '../slices/feed-slice';
import profileOrdersReducer from '../slices/profile-orders-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  feed: feedReducer,
  profileOrders: profileOrdersReducer
});
