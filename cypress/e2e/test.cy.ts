const API_URL = Cypress.env('BURGER_API_URL');

Cypress.on('uncaught:exception', () => false);

describe('Cypress: конструктор бургера', () => {
  beforeEach(() => {
    // токены
    window.localStorage.setItem('refreshToken', 'testRefreshToken');
    cy.setCookie('accessToken', 'testAccessToken');

    // ingredients
    cy.fixture('ingredients.json').then((ingredients) => {
      cy.intercept('GET', `${API_URL}/ingredients`, ingredients).as(
        'getIngredients'
      );
    });

    // user
    cy.fixture('user.json').then((user) => {
      cy.intercept('GET', `${API_URL}/auth/user`, user).as('getUser');
    });

    // feed
    cy.fixture('orders.json').then((orders) => {
      cy.intercept('GET', `${API_URL}/orders/all`, orders).as('getOrders');
    });

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
  });

  // добавляем один ингредиент
  it('Добавление ингредиента из списка в конструктор', () => {
    cy.contains('Добавить').first().click();

    // проверка: в конструкторе появилось что-то добавленное
    cy.fixture('ingredients.json').then((resp) => {
      const name = resp.data[0].name;
      cy.contains(name).should('exist');
    });
  });

  it('Модалка ингредиента: открытие и закрытие по крестику', () => {
    cy.fixture('ingredients.json').then((resp) => {
      const name = resp.data[0].name;

      // открываем модалку (клик по Link с именем ингредиента)
      cy.contains(name).click();

      // проверяем, что модалка реально открылась
      cy.get('#modals').contains(name).should('exist');

      // закрываем по крестику
      cy.get('#modals').find('button[type="button"]').first().click();

      // модалка закрылась
      cy.get('#modals').contains(name).should('not.exist');
    });
  });

  it('Модалка ингредиента: закрытие по клику на оверлей', () => {
    cy.fixture('ingredients.json').then((resp) => {
      const name = resp.data[0].name;

      cy.contains(name).click();
      cy.get('#modals').contains(name).should('exist');

      // клик по оверлею
      cy.get('body').click(5, 5);

      cy.get('#modals').contains(name).should('not.exist');
    });
  });

  it('Создание заказа: номер верный, модалка закрывается, конструктор очищен', () => {
    cy.fixture('newOrder.json').then((newOrder) => {
      cy.intercept('POST', `${API_URL}/orders`, newOrder).as('createOrder');

      cy.contains('Добавить').click();
      cy.contains('Добавить').click();

      cy.contains('button', 'Оформить заказ').click();

      cy.wait('@createOrder');

      cy.get('#modals').contains(String(newOrder.order.number)).should('exist');

      cy.get('#modals').find('button[type="button"]').first().click();

      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });
  });
});
