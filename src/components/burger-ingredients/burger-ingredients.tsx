import { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from '../../services/store';
import { useInView } from 'react-intersection-observer';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '@ui';

export const BurgerIngredients: FC = () => {
  // данные из стора
  const ingredients = useSelector((state) => state.ingredients.items);

  // разбиваем ингредиенты по типам
  const buns = ingredients.filter((item) => item.type === 'bun');
  const mains = ingredients.filter((item) => item.type === 'main');
  const sauces = ingredients.filter((item) => item.type === 'sauce');

  // текущая активная вкладка
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  // refs для скролла
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  // отслеживание видимости секций
  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewMains] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  // смена активного таба при скролле
  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewMains) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewMains, inViewSauces]);

  // клик по табу, скролл к секции
  const onTabClick = (tab: string) => {
    const typedTab = tab as TTabMode;
    setCurrentTab(typedTab);

    if (typedTab === 'bun') {
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    if (typedTab === 'main') {
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    if (typedTab === 'sauce') {
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
