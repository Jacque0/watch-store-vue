/// <reference types="cypress" />

import { makeServer } from '../../miragejs/server';

context('Store', () => {
  let server;
  const gId = cy.getByTestId;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should display the store', () => {
    cy.visit('http://localhost:3000/');
    cy.get('body').contains('Brand');
    cy.get('body').contains('Wrist Watch');
  });

  context('Store > Shopping Cart', () => {
    beforeEach(() => {
      server.createList('product', 10);
      cy.visit('http://localhost:3000/');
    });

    it('should not display shopping cart when page first loads', () => {
      gId('shopping-cart').should('have.class', 'hidden');
    });

    it('should toggle shopping cart visibility when is clicked', () => {
      gId('toggle-button').click();
      gId('shopping-cart').should('not.have.class', 'hidden');
      gId('toggle-button').click({ force: true });
      gId('shopping-cart').should('have.class', 'hidden');
    });

    it('should open shopping cart when a product is added', () => {
      gId('product-card').first().find('button').click();

      gId('shopping-cart').should('not.have.class', 'hidden');
    });

    it('should add first product to the cart', () => {
      gId('product-card').first().find('button').click();

      gId('cart-item').should('have.length', 1);
    });

    it('should add 3 products to the cart', () => {
      gId('product-card').eq(1).find('button').click();
      gId('product-card').eq(2).find('button').click({ force: true });
      gId('product-card').eq(3).find('button').click({ force: true });

      gId('cart-item').should('have.length', 3);
    });
  });

  context('Store > Product List', () => {
    it('should display "0 Products" when no product is returned', () => {
      cy.visit('http://localhost:3000/');
      gId('product-card').should('have.length', 0);
      cy.get('body').contains('0 Products');
    });
    it('should display "1 Product" when 1 product is returned', () => {
      server.create('product');

      cy.visit('http://localhost:3000/');
      cy.get('body').contains('1 Product');
    });
    it('should display "10 Products" when 10 products are returned', () => {
      server.createList('product', 10);

      cy.visit('http://localhost:3000/');
      cy.get('body').contains('10 Products');
    });
  });

  context('Store > Search for Products', () => {
    it('should type in the search field', () => {
      cy.visit('http://localhost:3000/');

      cy.get('input[type="search"]')
        .type('Some text here')
        .should('have.value', 'Some text here');
    });

    it('should return 1 product when "Relógio bonito" is used as search term', () => {
      server.create('product', {
        title: 'Relógio bonito',
      });
      server.createList('product', 10);

      cy.visit('http://localhost:3000/');
      cy.get('input[type="search"]').type('Relógio bonito');
      gId('search-form').submit();
      gId('product-card').should('have.length', 1);
    });

    it('should not return any product', () => {
      server.createList('product', 10);

      cy.visit('http://localhost:3000/');
      cy.get('input[type="search"]').type('Relógio bonito');
      gId('search-form').submit();
      gId('product-card').should('have.length', 0);
      cy.get('body').contains('0 Products');
    });
  });
});
