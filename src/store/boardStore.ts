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
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'dark' ? 'light' : 'dark' 
      })),
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
        set(state => {
          const { columns } = state;

          // Safely get the source and destination columns
          const sourceColumn = columns[sourceColumnId];
          const destColumn = columns[destColumnId];

          // If either column is not found, abort the move to prevent a crash.
          if (!sourceColumn || !destColumn) {
            console.error("Move failed: Invalid source or destination column ID.");
            // Return original state without changes
            return state; 
          }

          // Check WIP limit only when moving to a DIFFERENT column
          if (sourceColumnId !== destColumnId) {
            if (destColumn.ticketIds.length >= destColumn.limit) {
              // Use setTimeout to avoid blocking state update with an alert
              setTimeout(() => {
                alert(`Column "${destColumn.name}" has reached its limit of ${destColumn.limit} tickets.`);
              }, 0);
              return state; // Abort the move
            }
          }

          // Remove ticket from the source column's ticketIds
          const newSourceTicketIds = sourceColumn.ticketIds.filter(id => id !== ticketId);

          // Create the updated source column
          const newSourceColumn = {
            ...sourceColumn,
            ticketIds: newSourceTicketIds,
          };

          let newDestColumn = { ...destColumn };

          // Add ticket to the destination column's ticketIds
          if (sourceColumnId === destColumnId) {
            // Reordering within the same column
            newSourceTicketIds.splice(newIndex, 0, ticketId);
            newSourceColumn.ticketIds = newSourceTicketIds;
            newDestColumn = newSourceColumn; // They are the same column
          } else {
            // Moving to a different column
            const newDestTicketIds = [...destColumn.ticketIds];
            newDestTicketIds.splice(newIndex, 0, ticketId);
            newDestColumn.ticketIds = newDestTicketIds;
          }

          // Return the new state
          return {
            columns: {
              ...columns,
              [sourceColumnId]: newSourceColumn,
              [destColumnId]: newDestColumn,
            },
          };
        });
      },
    }),
    {
      name: 'kanban-board-storage',
    }
  )
);