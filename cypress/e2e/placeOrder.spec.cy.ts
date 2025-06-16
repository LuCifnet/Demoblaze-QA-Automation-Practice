import placeOrder from '../support/pages/PlaceOrder';
import { faker } from '@faker-js/faker';

describe('Place Order Test Suite', () => {
    beforeEach(() => {
        cy.visitHomepage();
    });

    describe('Successful Order Placement', () => {
        it('TC001 | Should place order successfully with default product', () => {
            placeOrder.placeOrder();
        });

        it('TC002 | Should place order with single custom product', () => {
            placeOrder.placeOrderWithSingleProduct(
                'Nokia lumia 1520',
                { title: 'Nokia lumia 1520', price: 820 }
            );
        });

        it('TC003 | Should place order with multiple products', () => {
            placeOrder.placeOrderWithMultipleProducts(
                ['Samsung galaxy s6', 'Nokia lumia 1520'],
                [
                    { title: 'Samsung galaxy s6', price: 360 },
                    { title: 'Nokia lumia 1520', price: 820 }
                ]
            );
        });

        it('TC004 | Should place order with custom customer details', () => {
            const customerData = {
                name: faker.person.fullName(),
                country: 'Nepal',
                city: 'Kathmandu'
            };

            placeOrder.placeOrderWithCustomDetails(
                ['Samsung galaxy s6'],
                [{ title: 'Samsung galaxy s6', price: 360 }],
                customerData.name,
                customerData.country,
                customerData.city
            );
        });

        it('TC005 | Should place order with specific valid details', () => {
            const orderDetails = {
                name: 'John Doe',
                country: 'USA',
                city: 'New York',
                card: '4111 1111 1111 1111',
                month: '12',
                year: '2026'
            };

            placeOrder.placeOrder(
                ['Samsung galaxy s6'],
                [{ title: 'Samsung galaxy s6', price: 360 }],
                orderDetails
            );
        });
    });

    describe('Order Form Validation', () => {
        it('TC006 | Should handle invalid card details gracefully', () => {
            placeOrder.placeOrderWithInvalidCard();
        });

        it('TC007 | Should place order with minimum required fields', () => {
            const minimalDetails = {
                name: 'Test User',
                country: 'Test Country',
                city: 'Test City'
            };

            placeOrder.placeOrder(
                ['Samsung galaxy s6'],
                [{ title: 'Samsung galaxy s6', price: 360 }],
                minimalDetails
            );
        });
    });

    describe('Edge Cases', () => {
        it('TC008 | Should place order with very long customer name', () => {
            const longNameDetails = {
                name: faker.person.fullName() + ' ' + faker.person.fullName() + ' ' + faker.person.fullName(),
                country: 'Nepal',
                city: 'Kathmandu'
            };

            placeOrder.placeOrder(
                ['Samsung galaxy s6'],
                [{ title: 'Samsung galaxy s6', price: 360 }],
                longNameDetails
            );
        });

        it('TC009 | Should place order with special characters in fields', () => {
            const specialCharDetails = {
                name: 'John O\'Connor-Smith',
                country: 'São Paulo',
                city: 'Zürich'
            };

            placeOrder.placeOrder(
                ['Samsung galaxy s6'],
                [{ title: 'Samsung galaxy s6', price: 360 }],
                specialCharDetails
            );
        });
    });

    describe('Data-Driven Tests', () => {
        const testData = [
            {
                testId: 'TC010',
                description: 'Should place order for Samsung Galaxy S6',
                product: 'Samsung galaxy s6',
                expectedProduct: { title: 'Samsung galaxy s6', price: 360 },
                customerCountry: 'Nepal'
            },
            {
                testId: 'TC011',
                description: 'Should place order for Nokia Lumia',
                product: 'Nokia lumia 1520',
                expectedProduct: { title: 'Nokia lumia 1520', price: 820 },
                customerCountry: 'India'
            },
            {
                testId: 'TC012',
                description: 'Should place order for Sony Xperia',
                product: 'Sony xperia z5',
                expectedProduct: { title: 'Sony xperia z5', price: 320 },
                customerCountry: 'USA'
            }
        ];

        testData.forEach((data) => {
            it(`${data.testId} | ${data.description}`, () => {
                const customerDetails = {
                    name: faker.person.fullName(),
                    country: data.customerCountry,
                    city: faker.location.city()
                };

                placeOrder.placeOrder(
                    [data.product],
                    [data.expectedProduct],
                    customerDetails
                );
            });
        });
    });

    describe('Performance Tests', () => {
        it('TC013 | Should complete order placement within acceptable time', () => {
            const startTime = Date.now();
            
            placeOrder.placeOrder();
            
            cy.then(() => {
                const endTime = Date.now();
                const duration = endTime - startTime;
                expect(duration).to.be.lessThan(30000); // 30 seconds max
            });
        });
    });

   
});