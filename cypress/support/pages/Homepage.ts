import { el } from "@faker-js/faker/.";
import HeaderSection from "./HeaderSection";

export class HomePage {
    private readonly categorySelector = '.list-group';
    private readonly footerSelector = '.grrrr';
    private readonly productListSelector = '#tbodyid';
    private readonly productCardSelector = '.col-lg-4.col-md-6.mb-4';
    private readonly nextPrevSelector = '.page-link';
    private readonly nextButtonSelector = '#next2';
    private readonly prevButtonSelector = '#prev2';
    private readonly carouselContainerSelector = '#contcar';
    private readonly carouselIndicatorsSelector = '#carouselExampleIndicators .carousel-indicators li';
    private readonly carouselActiveItemSelector = '#carouselExampleIndicators .carousel-inner .carousel-item.active';

    verifyHomePageElement(): void {
        HeaderSection.verifyAllNavLinks();
        this.verifyHeroImage();

        cy.log('Verifying Main Content is visible');
        cy.get(this.categorySelector).should('be.visible');

        cy.log('Verifying Pagination Buttons are visible');
        cy.get(this.nextPrevSelector).should('be.visible');

        cy.log('Verifying Footer is visible');
        cy.get(this.footerSelector).should('be.visible');

        // Verify all products including across pagination
        this.verifyAllProducts();
    }

    verifyAllProducts(): void {
        const validateProducts = () => {
            cy.log('Checking if product list container is visible');
            cy.get(this.productListSelector).should('be.visible');

            cy.log('Validating each product card on current page');
            cy.get(this.productCardSelector).each(($el: JQuery<HTMLElement>, index: number) => {
                cy.wrap($el).within(() => {
                    cy.get('.card-img-top')
                        .should('have.attr', 'src')
                        .and('include', '.jpg');

                    cy.get('.card-title a')
                        .should('be.visible')
                        .and('not.be.empty');

                    cy.get('h5').should('contain.text', '$');
                    cy.get('.card-text').should('not.be.empty');
                });
                cy.log(`Product ${index + 1} is valid`);
            });
        };

        const handlePagination = () => {
            validateProducts();

            cy.get(this.nextButtonSelector).then(($btn) => {
                if ($btn.is(':visible') && !$btn.is(':disabled')) {
                    cy.log('Clicking Next to load more products');
                    cy.wrap($btn).click();
                    cy.wait(1000);
                    handlePagination();
                } else {
                    cy.log('No more pages. All products validated.');
                    clickSinglePreviousButtonOnce();
                }
            });
        };

        const clickSinglePreviousButtonOnce = () => {
            cy.get(this.prevButtonSelector).then(($btn) => {
                if ($btn.is(':visible') && !$btn.is(':disabled')) {
                    cy.log('Clicking Previous once to return to first page');
                    cy.wrap($btn).click();
                    cy.wait(1000);
                    cy.log('Redirecting to homepage');
                    cy.visit('/');
                } else {
                    cy.log('Previous button not clickable or already on first page');
                }
            });
        };

        handlePagination();
    }

    clickCategoryAndVerifyListChanged(categoryName: string): void {
        cy.log(`Clicking and verifying category filter: ${categoryName}`);

        // Capture initial product titles
        cy.get(this.productCardSelector)
            .find('.card-title a')
            .then(($before) => {
                const beforeProducts = [...$before].map(el => el.innerText.trim());

                // Click the category
                cy.get(this.categorySelector)
                    .contains('a.list-group-item', categoryName)
                    .should('be.visible')
                    .click();

                cy.wait(1000);

                // Capture product titles after filter
                cy.get(this.productCardSelector)
                    .find('.card-title a')
                    .then(($after) => {
                        const afterProducts = [...$after].map(el => el.innerText.trim());

                        expect(afterProducts).to.not.deep.equal(beforeProducts);
                        expect(afterProducts.length).to.be.greaterThan(0);
                    });
            });
    }


 clickProductLinkOpenCorrectPage(productTitle: string): void {
    cy.log(`Opening product page for: ${productTitle}`);

    // Find the product by title and store the text
    cy.contains(this.productCardSelector + ' .card-title a', productTitle)
      .should('be.visible')
      .then(($el) => {
          const titleText = $el.text().trim();
          cy.wrap(titleText).as('clickedProductTitle'); // store text
          cy.wrap($el).click(); // click the actual element
      });

    cy.url().should('include', 'prod.html?idp_');

    // Validate the detail page is correctly loaded
    cy.get('.name').should('be.visible').and('not.be.empty');
    cy.get('.price-container').should('contain.text', '$');
    cy.get('img').should('be.visible').and('have.attr', 'src');

    // Compare product title with detail page
    cy.get('@clickedProductTitle').then((expectedTitle) => {
        cy.get('.name').should('contain.text', expectedTitle);
    });
}



    checkNextButtonWork(): void {
        cy.log("Capturing product titles before clicking Next");

        cy.get(this.productCardSelector)
            .find('.card-title a')
            .then(($before) => {
                const beforeTitles = [...$before].map(el => el.innerText.trim());
                cy.log(`Titles before clicking Next: ${beforeTitles.join(', ')}`);

                cy.get(this.nextButtonSelector)
                    .should('be.visible')
                    .and('not.be.disabled');

                cy.log("👉 Clicking the Next button");
                cy.get(this.nextButtonSelector).click();

                cy.wait(1000); // Wait for the products to load

                cy.log("Capturing product titles after clicking Next");
                cy.get(this.productCardSelector)
                    .find('.card-title a')
                    .then(($after) => {
                        const afterTitles = [...$after].map(el => el.innerText.trim());
                        cy.log(`Titles after clicking Next: ${afterTitles.join(', ')}`);

                        // Assert that the product list changed
                        expect(afterTitles, 'Product titles should change after clicking Next')
                            .to.not.deep.equal(beforeTitles);

                        expect(afterTitles.length, 'Product list after Next should not be empty')
                            .to.be.greaterThan(0);

                        cy.log("Next button is working. Product list updated.");
                    });
            });
    }

    checkPrevButtonWork(): void {
        cy.log("⏭ Navigating to next page first");
        this.checkNextButtonWork();

        cy.log("Capturing product titles on the second page");
        cy.get(this.productCardSelector)
            .find('.card-title a')
            .then(($afterNext) => {
                const titlesAfterNext = [...$afterNext].map(el => el.innerText.trim());
                cy.log(`Titles on second page: ${titlesAfterNext.join(', ')}`);

                cy.get(this.prevButtonSelector)
                    .should('be.visible')
                    .and('not.be.disabled');

                cy.log("👈 Clicking the Previous button");
                cy.get(this.prevButtonSelector).click();
                cy.wait(1000); // Wait for the first page to reload

                cy.log("Capturing product titles after clicking Previous");
                cy.get(this.productCardSelector)
                    .find('.card-title a')
                    .then(($afterPrev) => {
                        const titlesAfterPrev = [...$afterPrev].map(el => el.innerText.trim());
                        cy.log(`Titles after going back to first page: ${titlesAfterPrev.join(', ')}`);

                        expect(titlesAfterPrev, 'Should return to original first-page product titles')
                            .to.not.deep.equal(titlesAfterNext);

                        expect(titlesAfterPrev.length, 'First-page product list should not be empty')
                            .to.be.greaterThan(0);

                        cy.log("Previous button works correctly. Returned to first page.");
                    });
            });
    }

    verifyHeroImage(): void {
        cy.log('Verifying Carousel is visible and functional');
        cy.get(this.carouselContainerSelector).should('be.visible');
        cy.get(this.carouselIndicatorsSelector).its('length').should('be.gte', 1);
        cy.get(this.carouselActiveItemSelector).within(() => {
            cy.get('img')
                .should('be.visible')
                .and('have.attr', 'src')
                .and('match', /\.(jpg|jpeg|png|gif)$/i);
        });
    }

    verifyCarouselNextButton(): void {
        cy.get('.carousel-item.active img').then(($img) => {
            const initialSrc = $img.attr('src');

            // Click the Next button
            cy.get('a.carousel-control-next').should('be.visible').click();

            // Wait for slide transition to complete
            cy.wait(1000);

            // Verify the active slide's image src has changed
            cy.get('.carousel-item.active img').should(($newImg) => {
                expect($newImg.attr('src')).not.to.eq(initialSrc);
            });
        });
    }
    verifyCarouselPrevButton(): void {
        cy.get('.carousel-item.active img').then(($img) => {
            const initialSrc = $img.attr('src');

            // Click the Next button
            cy.get('a.carousel-control-prev').should('be.visible').click();

            // Wait for slide transition to complete
            cy.wait(1000);

            // Verify the active slide's image src has changed
            cy.get('.carousel-item.active img').should(($newImg) => {
                expect($newImg.attr('src')).not.to.eq(initialSrc);
            });
        });
    }
    verifyCategoryNotPreservedAfterRefresh(): void {
        // Click on the "Laptops" category
        cy.contains('Laptops').click();

        // Wait for the products to load and assert a known laptop is visible
        cy.contains('.card-title', 'Sony vaio i5').should('be.visible');

        // Refresh the page
        cy.reload();

        // Wait for the full product list to reload
        cy.wait(1000);

        // Verify that the homepage is reset and mixed-category items are shown
        cy.get('.card-title').then(($titles) => {
            const titles = [...$titles].map(el => el.innerText.trim());
            cy.log('Products after refresh:', titles);


            expect(titles).to.include('Samsung galaxy s6');
            expect(titles).to.include('HTC One M9');


            expect(titles).to.include('Sony vaio i5');
        });
    }

    addProductsInCart(productTitle: string): void {
    this.clickProductLinkOpenCorrectPage(productTitle);

    cy.log('Clicking Add to Cart button');
    cy.contains('a', 'Add to cart').click();

    // Handle alert
    cy.on('window:alert', (text) => {
        expect(text).to.eq('Product added');
    });

    cy.go('back');
}





}

export default new HomePage();
