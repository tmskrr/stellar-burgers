import reducer, { fetchIngredients } from './ingredients-slice';
import type { TIngredient } from '../utils/types';
import { UnknownAction } from '@reduxjs/toolkit';

describe('ingredientsSlice reducer', () => {
  const getInitialState = () =>
    reducer(undefined, { type: 'UNKNOWN_ACTION' } as UnknownAction);

  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Test ingredient',
      type: 'main',
      proteins: 1,
      fat: 1,
      carbohydrates: 1,
      calories: 1,
      price: 100,
      image: 'img',
      image_mobile: 'img',
      image_large: 'img'
    }
  ];

  it('pending: должен поставить isLoading=true и очистить error', () => {
    const state = reducer(getInitialState(), {
      type: fetchIngredients.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fulfilled: должен записать ингредиенты и выключить isLoading', () => {
    const state = reducer(getInitialState(), {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    });

    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
  });

  it('rejected: должен записать ошибку и выключить isLoading', () => {
    const state = reducer(getInitialState(), {
      type: fetchIngredients.rejected.type,
      error: { message: 'Network error' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Network error');
  });
});
