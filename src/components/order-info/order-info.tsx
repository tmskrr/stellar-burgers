import { FC, useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { getOrderByNumberApi } from '../../utils/burger-api';

export const OrderInfo: FC = () => {
  const { number } = useParams();

  const ingredients = useSelector((state) => state.ingredients.items);

  const ordersFromFeed = useSelector((state) => state.feed.orders);
  const ordersFromProfile = useSelector((state) => state.profileOrders?.orders);

  const orderFromStore =
    ordersFromFeed.find((order) => order.number === Number(number)) ||
    ordersFromProfile?.find((order) => order.number === Number(number));

  const [orderFromApi, setOrderFromApi] = useState<TOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!number || orderFromStore) return;

    const orderNumber = Number(number);
    if (Number.isNaN(orderNumber)) return;

    setIsLoading(true);

    getOrderByNumberApi(orderNumber)
      .then((res) => {
        setOrderFromApi(res.orders[0]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [number, orderFromStore]);

  const actualOrder = orderFromStore || orderFromApi;

  const orderInfo = useMemo(() => {
    if (!actualOrder || !ingredients.length) return null;

    const date = new Date(actualOrder.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = actualOrder.ingredients.reduce(
      (acc: TIngredientsWithCount, itemId) => {
        const ingredient = ingredients.find((ing) => ing._id === itemId);
        if (!ingredient) return acc;

        if (!acc[itemId]) {
          acc[itemId] = { ...ingredient, count: 1 };
        } else {
          acc[itemId].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...actualOrder,
      ingredientsInfo,
      date,
      total
    };
  }, [actualOrder, ingredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
