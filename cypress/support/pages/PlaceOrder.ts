import { faker } from "@faker-js/faker";
import CartSection from "./CartSection";
import Homepage from "./Homepage";

// Types for better type safety
interface Product {
    title: string;
    price: number;
}

interface OrderDetails {
    name?: string;
    country?: string;
    city?: string;
    card?: string;
    month?: string;
    year?: string;
}

export class PlaceOrder {
    // Selectors - centralized and reusable
    private readonly selectors = {
        placeOrderButton: 'button:contains("Place Order")',
        nameInput: '#name',
        countryInput: '#country',
        cityInput: '#city',
        cardInput: '#card',
        monthInput: '#month',
        yearInput: '#year',
        purchaseButton: 'button:contains("Purchase")',
        successAlert: '.sweet-alert',
        successTitle: '.sweet-alert h2',
        confirmButton: '.sweet-alert .confirm'
    };

    // Default test data using faker
    private readonly defaultOrderDetails: OrderDetails = {
        name: faker.person.fullName(),
        country: faker.location.country(),
        city: faker.location.city(),
        card: faker.finance.creditCardNumber(),
        month: faker.date.future().getMonth().toString().padStart(2, '0'),
        year: faker.date.future().getFullYear().toString()
    };

    // Reusable method to add products and navigate to cart
    private prepareCart(products: string[]): void {
        products.forEach(product => {
            Homepage.addProductsInCart(product);
        });
        CartSection.clickCartNav();
    }

    // Reusable method to fill order form
    private fillOrderForm(orderDetails: OrderDetails = {}): void {
        const details = { ...this.defaultOrderDetails, ...orderDetails };
        
        cy.get(this.selectors.nameInput).clear().type(details.name!);
        cy.get(this.selectors.countryInput).clear().type(details.country!);
        cy.get(this.selectors.cityInput).clear().type(details.city!);
        cy.get(this.selectors.cardInput).clear().type(details.card!);
        cy.get(this.selectors.monthInput).clear().type(details.month!);
        cy.get(this.selectors.yearInput).clear().type(details.year!);
    }

    // Reusable method to verify success message
    private verifyOrderSuccess(): void {
        cy.get(this.selectors.successAlert).should('be.visible');
        cy.get(this.selectors.successTitle).should('contain', 'Thank you for your purchase!');
        cy.get(this.selectors.confirmButton).click();
    }

    // Main method - now more flexible and reusable
    placeOrder(
        products: string[] = ['Samsung galaxy s6'],
        expectedProducts: Product[] = [{ title: 'Samsung galaxy s6', price: 360 }],
        orderDetails: OrderDetails = {}
    ): void {
        this.prepareCart(products);
        CartSection.checkCartSectionAfterProductAdd(expectedProducts);
        
        cy.get(this.selectors.placeOrderButton).click();
        this.fillOrderForm(orderDetails);
        cy.get(this.selectors.purchaseButton).click();
        this.verifyOrderSuccess();
    }

    // Convenience methods for common scenarios
    placeOrderWithSingleProduct(
        productName: string,
        expectedProduct: Product,
        orderDetails: OrderDetails = {}
    ): void {
        this.placeOrder([productName], [expectedProduct], orderDetails);
    }

    placeOrderWithMultipleProducts(
        products: string[],
        expectedProducts: Product[],
        orderDetails: OrderDetails = {}
    ): void {
        this.placeOrder(products, expectedProducts, orderDetails);
    }

    // Method to place order with specific user details
    placeOrderWithCustomDetails(
        products: string[] = ['Samsung galaxy s6'],
        expectedProducts: Product[] = [{ title: 'Samsung galaxy s6', price: 360 }],
        customerName: string,
        customerCountry: string,
        customerCity: string
    ): void {
        const customDetails: OrderDetails = {
            name: customerName,
            country: customerCountry,
            city: customerCity
        };
        
        this.placeOrder(products, expectedProducts, customDetails);
    }

    // Method for testing with invalid card details
    placeOrderWithInvalidCard(
        products: string[] = ['Samsung galaxy s6'],
        expectedProducts: Product[] = [{ title: 'Samsung galaxy s6', price: 360 }]
    ): void {
        const invalidCardDetails: OrderDetails = {
            card: '0000 0000 0000 0000',
            month: '13', 
            year: '2020' 
        };
        
        this.prepareCart(products);
        CartSection.checkCartSectionAfterProductAdd(expectedProducts);
        
        cy.get(this.selectors.placeOrderButton).click();
        this.fillOrderForm(invalidCardDetails);
        cy.get(this.selectors.purchaseButton).click();
    }
}

export default new PlaceOrder();