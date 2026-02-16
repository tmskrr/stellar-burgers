import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructor-slice';

import type { TIngredient } from '../utils/types';
import { UnknownAction } from '@reduxjs/toolkit';

jest.mock('@reduxjs/toolkit', () => {
  const actual = jest.requireActual('@reduxjs/toolkit');
  return {
    ...actual,
    nanoid: jest.fn(() => 'test-id')
  };
});

describe('constructorSlice reducer', () => {
  const initialState = reducer(undefined, {
    type: 'UNKNOWN_ACTION'
  } as UnknownAction);

  const bun: TIngredient = {
    _id: 'bun-id',
    name: 'Bun',
    type: 'bun',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 100,
    image: 'img',
    image_mobile: 'img',
    image_large: 'img'
  };

  const main: TIngredient = {
    _id: 'main-id',
    name: 'Main',
    type: 'main',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 200,
    image: 'img',
    image_mobile: 'img',
    image_large: 'img'
  };

  it('addIngredient: должен положить булку в bun', () => {
    const state = reducer(initialState, addIngredient(bun));

    expect(state.bun).toEqual({ ...bun, id: 'test-id' });
    expect(state.ingredients).toEqual([]);
  });

  it('addIngredient: должен добавить начинку в ingredients и проставить id', () => {
    const state = reducer(initialState, addIngredient(main));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([{ ...main, id: 'test-id' }]);
  });

  it('removeIngredient: должен удалить начинку по id', () => {
    const startState = {
      bun: null,
      ingredients: [
        { ...main, id: 'id-1' },
        { ...main, id: 'id-2' }
      ]
    };

    const state = reducer(startState, removeIngredient('id-1'));

    expect(state.ingredients).toEqual([{ ...main, id: 'id-2' }]);
  });

  it('moveIngredient: должен поменять порядок ингредиентов в начинке', () => {
    const startState = {
      bun: null,
      ingredients: [
        { ...main, id: 'id-1', name: 'A' },
        { ...main, id: 'id-2', name: 'B' },
        { ...main, id: 'id-3', name: 'C' }
      ]
    };

    const state = reducer(
      startState,
      moveIngredient({ fromIndex: 0, toIndex: 2 })
    );

    expect(state.ingredients.map((i) => i.id)).toEqual([
      'id-2',
      'id-3',
      'id-1'
    ]);
  });

  it('clearConstructor: должен очищать bun и ingredients', () => {
    const startState = {
      bun: { ...bun, id: 'bun-1' },
      ingredients: [{ ...main, id: 'id-1' }]
    };

    const state = reducer(startState, clearConstructor());

    expect(state).toEqual(initialState);
  });
});
