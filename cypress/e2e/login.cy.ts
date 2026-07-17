describe('Login Flow', () => {
  beforeEach(() => {
    localStorage.removeItem('signal_access_token');
    localStorage.removeItem('signal_refresh_token');
  });

  it('should display the login screen with brand details and buttons', () => {
    cy.visit('/login');
    cy.contains('SIGNAL');
    cy.contains('Cut through the noise.');
    cy.get('.login-btn--google').should('exist');
    cy.get('.login-btn--microsoft').should('exist');
  });

  it('should handle OAuth callback redirect and fetch user profile successfully', () => {
    cy.intercept('POST', '**/api/auth/callback', {
      body: {
        data: {
          accessToken: 'mock_access_token',
          refreshToken: 'mock_refresh_token'
        },
        error: null
      }
    }).as('authCallback');

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
    }).as('getMe');

    cy.intercept('GET', '**/api/integrations', {
      body: {
        data: [
          { id: 'int_1', provider: 'SLACK', status: 'ACTIVE', lastSyncedAt: new Date().toISOString() }
        ],
        error: null
      }
    }).as('getIntegrations');

    cy.intercept('GET', '**/api/triage/today', {
      body: {
        data: [],
        error: null
      }
    });

    cy.intercept('GET', '**/api/triage/focus-slots', {
      body: {
        data: [],
        error: null
      }
    });

    cy.intercept('GET', '**/api/triage/preferences', {
      body: {
        data: { statedPriorities: '', digestTime: null, digestChannel: 'NONE' },
        error: null
      }
    });

    cy.visit('/oauth-callback?code=mock_code&state=mock_state');

    cy.wait('@authCallback');
    cy.wait('@getMe');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('signal_access_token')).to.equal('mock_access_token');
      expect(win.localStorage.getItem('signal_refresh_token')).to.equal('mock_refresh_token');
    });

    cy.url().should('include', '/app/triage');
  });
});
