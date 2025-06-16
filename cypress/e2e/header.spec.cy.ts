import headerSection from '../pages/HeaderSection'

describe('Header Section Test', () => {
    beforeEach(() => {
        cy.visitHomepage();
    })

    it('HEADER001 | Title: Verify All Header Elements Load', () => {
        headerSection.verifyAllNavLinks()
    })
    it('HEADER002 | Title: Should verify all nav links functionality', () => {
        headerSection.verifyAllNavLinksFunctionality();
    })

    // it.only('HEADER003 | Title: Should verify all nav links functionality', () => {
    //     headerSection.verifyContact();
    // })
    it('HEADER003 | Title: Should show correct color on hover for all visible nav links', () => {
        headerSection.verifyNavLinkHoverEffects();
    });

})