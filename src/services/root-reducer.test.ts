import { rootReducer } from './root-reducer';
import ingredientsReducer from '../slices/ingredients-slice';
import userReducer from '../slices/user-slice';
import constructorReducer from '../slices/constructor-slice';
import orderReducer from '../slices/order-slice';
import feedReducer from '../slices/feed-slice';
import profileOrdersReducer from '../slices/profile-orders-slice';

describe('rootReducer', () => {
  it('должен вернуть корректное начальное состояние при UNKNOWN_ACTION', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };

    const state = rootReducer(undefined, unknownAction);

    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, unknownAction),
      user: userReducer(undefined, unknownAction),
      burgerConstructor: constructorReducer(undefined, unknownAction),
      order: orderReducer(undefined, unknownAction),
      feed: feedReducer(undefined, unknownAction),
      profileOrders: profileOrdersReducer(undefined, unknownAction)
    });
  });
});
