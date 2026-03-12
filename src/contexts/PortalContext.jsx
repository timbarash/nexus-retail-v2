import React, { createContext, useContext, useReducer } from 'react';

const PortalContext = createContext(null);

const MOCK_INTERACTIONS = [
  {
    id: 'mock-1',
    type: 'ticket',
    title: 'Ecommerce checkout page not loading for some customers',
    description: 'Multiple customers reporting blank checkout page on Safari browsers. Cleared cache but issue persists.',
    status: 'In Progress',
    priority: 'High',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    ticketId: 'CB-1042',
  },
  {
    id: 'mock-2',
    type: 'bug',
    title: 'Inventory count mismatch after bulk import',
    description: 'After importing 200+ SKUs via CSV, 12 items show incorrect stock counts. Steps to reproduce: upload CSV with duplicate SKU rows.',
    status: 'Open',
    priority: 'High',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    ticketId: 'CB-1038',
  },
  {
    id: 'mock-3',
    type: 'feature',
    title: 'Add customer loyalty points display on POS',
    description: 'Would like loyalty points balance visible during checkout so budtenders can remind customers of rewards.',
    status: 'Submitted',
    priority: 'Medium',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    ticketId: 'CB-1035',
  },
  {
    id: 'mock-4',
    type: 'demo',
    title: 'Demo request: Menu Boards',
    description: 'Interested in Menu Boards for in-store digital signage. 3 locations.',
    status: 'Open',
    priority: 'Medium',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    ticketId: 'CB-1030',
    productKey: 'menuBoards',
  },
  {
    id: 'mock-5',
    type: 'ticket',
    title: 'Need help configuring tax rates for new state',
    description: 'Expanding to New Mexico, need assistance setting up state and local cannabis tax rates.',
    status: 'Resolved',
    priority: 'Medium',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    ticketId: 'CB-1025',
  },
  {
    id: 'mock-6',
    type: 'bug',
    title: 'Discount stacking applies incorrectly on BOGO items',
    description: 'When a BOGO deal and a percentage discount are both active, the percentage discount applies to the free item as well.',
    status: 'Resolved',
    priority: 'Low',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    ticketId: 'CB-1020',
  },
  {
    id: 'mock-7',
    type: 'feature',
    title: 'Bulk SMS campaign scheduling',
    description: 'Ability to schedule SMS campaigns in advance with recurring send options.',
    status: 'In Progress',
    priority: 'Low',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    ticketId: 'CB-1015',
  },
  {
    id: 'mock-8',
    type: 'demo',
    title: 'Demo request: Dutchie Payments',
    description: 'Want to switch from cash-only to integrated payments. Need pricing and compliance info.',
    status: 'Resolved',
    priority: 'High',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    ticketId: 'CB-1010',
    productKey: 'payments',
  },
];

function portalReducer(state, action) {
  switch (action.type) {
    case 'ADD_INTERACTION':
      return { ...state, interactions: [action.payload, ...state.interactions] };
    case 'UPDATE_STATUS':
      return {
        ...state,
        interactions: state.interactions.map(i =>
          i.id === action.payload.id ? { ...i, status: action.payload.status } : i
        ),
      };
    default:
      return state;
  }
}

export function PortalProvider({ children }) {
  const [state, dispatch] = useReducer(portalReducer, {
    interactions: MOCK_INTERACTIONS,
  });

  const addInteraction = (interaction) => {
    dispatch({
      type: 'ADD_INTERACTION',
      payload: {
        id: `int-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: new Date().toISOString(),
        status: 'Open',
        priority: 'Medium',
        ...interaction,
      },
    });
  };

  const updateStatus = (id, status) => {
    dispatch({ type: 'UPDATE_STATUS', payload: { id, status } });
  };

  return (
    <PortalContext.Provider value={{ interactions: state.interactions, addInteraction, updateStatus }}>
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error('usePortal must be used within a PortalProvider');
  return ctx;
}
