import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';

import { createOrder, closeOrderModal } from '../../slices/order-slice';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // пользователь (для проверки авторизации)
  const user = useSelector((state) => state.user.user);

  // данные конструктора
  const bun = useSelector((state) => state.burgerConstructor.bun);
  const ingredients = useSelector(
    (state) => state.burgerConstructor.ingredients
  );

  // данные заказа
  const orderRequest = useSelector((state) => state.order.orderRequest);
  const orderModalData = useSelector((state) => state.order.orderModalData);

  // собираем объект для UI
  const constructorItems = {
    bun,
    ingredients
  };

  // клик по кнопке оформить заказ
  const onOrderClick = () => {
    // если не авторизован — на логин
    if (!user) {
      navigate('/login');
      return;
    }

    // если нет булки или уже идёт запрос — ничего не делаем
    if (!bun || orderRequest) return;

    // формируем массив id ингредиентов для API
    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    // отправляем заказ
    dispatch(createOrder(ingredientIds));
  };

  // закрытие модалки заказа
  const closeOrderModalHandler = () => {
    dispatch(closeOrderModal());
  };

  // считаем цену
  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce((sum, item) => sum + item.price, 0),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModalHandler}
    />
  );
};
