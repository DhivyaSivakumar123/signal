describe('Triage Feed View', () => {
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

    cy.intercept('GET', '**/api/integrations', {
      body: {
        data: [
          { id: 'int_1', provider: 'SLACK', status: 'ACTIVE', lastSyncedAt: new Date().toISOString() }
        ],
        error: null
      }
    });

    cy.intercept('GET', '**/api/triage/preferences', {
      body: {
        data: { statedPriorities: 'Focus on database stability', digestTime: '12:00', digestChannel: 'EMAIL' },
        error: null
      }
    });

    const nowTime = new Date();
    const mockItems = [
      {
        id: 'item_1',
        threadGroupId: 't_1',
        sources: ['SLACK'],
        senderName: 'Bob Vance',
        subjectOrPreview: 'DB server is running at 99% CPU capacity. Need immediate help!',
        urgency: 'NOW',
        reasonSnippet: 'Mentions server crash risk',
        receivedAt: nowTime.toISOString(),
        status: 'UNSEEN'
      },
      {
        id: 'item_2',
        threadGroupId: 't_2',
        sources: ['GMAIL'],
        senderName: 'Alice Smith',
        subjectOrPreview: 'Weekly status report updates',
        urgency: 'TODAY',
        reasonSnippet: 'Regular report due today',
        receivedAt: new Date(nowTime.getTime() - 2 * 60 * 60 * 1000).toISOString(), 
        status: 'UNSEEN'
      }
    ];

    cy.intercept('GET', '**/api/triage/today', {
      body: {
        data: mockItems,
        error: null
      }
    }).as('getTodayFeed');

    const slotStart = new Date(nowTime.getTime() - 3 * 60 * 60 * 1000); 
    const slotEnd = new Date(nowTime.getTime() - 1 * 60 * 60 * 1000);   
    cy.intercept('GET', '**/api/triage/focus-slots', {
      body: {
        data: [
          { startTime: slotStart.toISOString(), endTime: slotEnd.toISOString(), durationMinutes: 120 }
        ],
        error: null
      }
    }).as('getFocusSlots');
  });

  it('should render triage headers, items, preferences, and handle feedback submissions', () => {
    cy.visit('/app/triage');

    cy.wait('@getTodayFeed');
    cy.wait('@getFocusSlots');

    cy.contains('Today, Jane Doe');
    cy.contains('1 urgent · 1 today · 0 this week');

    cy.get('app-triage-section').eq(0).contains('Now');
    cy.get('app-triage-section').eq(0).contains('Bob Vance');
    cy.get('app-triage-section').eq(1).contains('Today');
    cy.get('app-triage-section').eq(1).contains('Alice Smith');

    cy.intercept('POST', '**/api/triage/items/item_1/feedback', {
      statusCode: 200,
      body: {}
    }).as('submitFeedback');

    cy.get('app-triage-card').eq(0).find('.action-btn').eq(0).click({ force: true });
    cy.wait('@submitFeedback');

    cy.contains("Got it — we'll adjust future scoring.");
  });

  it('should highlight cards when selecting a focus slot and dim others', () => {
    cy.visit('/app/triage');
    cy.wait('@getTodayFeed');
    cy.wait('@getFocusSlots');

    cy.get('.focus-item').eq(0).click();

    cy.get('app-triage-card').eq(1).find('.card').should('have.class', 'card--highlighted');

    cy.get('app-triage-card').eq(0).should('have.class', 'dim-by-slot');
  });
});
