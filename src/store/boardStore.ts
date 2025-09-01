import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Ticket, Column, BoardState } from '@/types';

const initialColumns: Record<string, Column> = {
  'todo': { id: 'todo', name: 'To Do', ticketIds: [], limit: 5 },
  'in-progress': { id: 'in-progress', name: 'In Progress', ticketIds: [], limit: 3 },
  'done': { id: 'done', name: 'Done', ticketIds: [], limit: 10 },
};

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      tickets: {},
      columns: initialColumns,
      theme: 'light',
      searchTerm: '',
      isLoading: false,
      error: null,
      setTheme: (theme) => set({ theme }),
      setSearchTerm: (term) => set({ searchTerm: term }),

      loadInitialData: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/tickets');
          if (!response.ok) throw new Error('Failed to fetch tickets');
          const initialTickets: Ticket[] = await response.json();

          const newTickets: Record<string, Ticket> = {};
          // Deep copy
          const newColumns = JSON.parse(JSON.stringify(initialColumns));

          for (const ticket of initialTickets) {
            newTickets[ticket.id] = ticket;
            if (newColumns[ticket.columnId]) {
              newColumns[ticket.columnId].ticketIds.push(ticket.id);
            }
          }
          set({ tickets: newTickets, columns: newColumns, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      moveTicket: (ticketId, sourceColumnId, destColumnId, newIndex) => {
        const { columns } = get();
        const sourceTicketIds = Array.from(columns[sourceColumnId].ticketIds);
        
        if (sourceColumnId !== destColumnId) {
          const destColumn = columns[destColumnId];
          if (destColumn.ticketIds.length >= destColumn.limit) {
            alert(`Column "${destColumn.name}" has reached its limit of ${destColumn.limit} tickets.`);
            return;
          }
        }
        
        const [removedTicketId] = sourceTicketIds.splice(sourceTicketIds.findIndex(id => id === ticketId), 1);
        
        if (sourceColumnId === destColumnId) {
          sourceTicketIds.splice(newIndex, 0, removedTicketId);
          set({
            columns: { ...columns, [sourceColumnId]: { ...columns[sourceColumnId], ticketIds: sourceTicketIds } }
          });
        } else {
          const destTicketIds = Array.from(columns[destColumnId].ticketIds);
          destTicketIds.splice(newIndex, 0, removedTicketId);
          set({
            columns: {
              ...columns,
              [sourceColumnId]: { ...columns[sourceColumnId], ticketIds: sourceTicketIds },
              [destColumnId]: { ...columns[destColumnId], ticketIds: destTicketIds }
            }
          });
        }
      }
    }),
    {
      name: 'kanban-board-storage',
    }
  )
);