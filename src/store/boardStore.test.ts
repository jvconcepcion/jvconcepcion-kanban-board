import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { useBoardStore } from './boardStore';
import { Column, Ticket } from '@/types';

const initialState = useBoardStore.getState();
const testColumns: Record<string, Column> = {
  'todo': { id: 'todo', name: 'To Do', ticketIds: ['TICKET-1'], limit: 5 },
  'in-progress': { id: 'in-progress', name: 'In Progress', ticketIds: ['TICKET-2'], limit: 3 },
  'done': { id: 'done', name: 'Done', ticketIds: [], limit: 10 },
};
const testTickets: Record<string, Ticket> = {
  'TICKET-1': { id: 'TICKET-1', name: 'First Ticket', columnId: 'todo', createdAt: '', updatedAt: '', description: '', tags: [] },
  'TICKET-2': { id: 'TICKET-2', name: 'Second Ticket', columnId: 'in-progress', createdAt: '', updatedAt: '', description: '', tags: [] },
};

describe('Zustand Board Store - Core Logic', () => {

  beforeEach(() => {
    useBoardStore.setState({
      ...initialState,
      columns: JSON.parse(JSON.stringify(testColumns)),
      tickets: JSON.parse(JSON.stringify(testTickets)),
    });
    jest.clearAllMocks();
  });

  describe('Ticket Movement', () => {
    it('should move a ticket to a different column', () => {
      const { moveTicket } = useBoardStore.getState();
      moveTicket('TICKET-1', 'todo', 'done', 0);
      const { columns } = useBoardStore.getState();
      expect(columns['todo'].ticketIds).not.toContain('TICKET-1');
      expect(columns['done'].ticketIds).toContain('TICKET-1');
      expect(columns['done'].ticketIds[0]).toBe('TICKET-1');
    });

    it('should reorder a ticket within the same column', () => {
      const { moveTicket } = useBoardStore.getState();
      useBoardStore.setState(state => ({
        columns: {
          ...state.columns,
          'todo': { ...state.columns['todo'], ticketIds: ['TICKET-1', 'TICKET-3'] }
        }
      }));
      moveTicket('TICKET-1', 'todo', 'todo', 1);
      const { columns } = useBoardStore.getState();
      expect(columns['todo'].ticketIds).toEqual(['TICKET-3', 'TICKET-1']);
    });
  });

  describe('Search and Filter', () => {
    it('should update the search term in the state', () => {
      const { setSearchTerm } = useBoardStore.getState();
      setSearchTerm('Test Search');
      expect(useBoardStore.getState().searchTerm).toBe('Test Search');
      setSearchTerm('');
      expect(useBoardStore.getState().searchTerm).toBe('');
    });
  });
});