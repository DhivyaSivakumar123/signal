describe('Onboarding Wizard Flow', () => {
  beforeEach(() => {
    localStorage.setItem('signal_access_token', 'mock_access_token');
    
    cy.intercept('GET', '**/api/me', {
      body: {
        data: {
          id: '123',
          email: 'manager@signal.com',
          name: 'Jane Doe',
          orgId: 'org_abc',
          role: 'MANAGER',
          oauthProvider: 'GOOGLE'
        },
        error: null
      }
    });
  });

  it('should guide the user through the 3-step wizard steps', () => {
    cy.intercept('GET', '**/api/integrations', {
      body: {
        data: [],
        error: null
      }
    }).as('emptyIntegrations');

    cy.visit('/onboarding');

    // Step 1: Welcome Step
    cy.contains('01 / 03');
    cy.contains('Hello, Jane Doe.');
    cy.get('.action-btn').click();

    // Step 2: Connect Step
    cy.contains('02 / 03');
    cy.contains('Connect your tools');
    
    cy.get('.card').eq(0).contains('Slack');
    cy.get('.card').eq(0).contains('Connect');

    cy.intercept('GET', '**/api/integrations', {
      body: {
        data: [
          { id: 'int_1', provider: 'SLACK', status: 'ACTIVE', lastSyncedAt: new Date().toISOString() }
        ],
        error: null
      }
    }).as('slackConnected');

    cy.visit('/onboarding');
    cy.get('.action-btn').click(); 
    
    cy.get('.card').eq(0).contains('✓ Connected');
    cy.get('.action-btn--continue').should('not.be.disabled').click();

    // Step 3: Done Step
    cy.contains('03 / 03');
    cy.contains("You're set.");
    cy.contains('Slack');
    cy.get('.action-btn').click();

    cy.url().should('include', '/app/triage');
  });
});
