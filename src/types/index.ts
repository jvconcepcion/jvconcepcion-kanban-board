export type ColumnId = 'todo' | 'in-progress' | 'done';

export interface Ticket {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  columnId: 'todo' | 'in-progress' | 'done';
};

export interface Column {
  id: 'todo' | 'in-progress' | 'done';
  name: string;
  ticketIds: string[];
  limit: number;
};

export interface BoardState {
  tickets: Record<string, Ticket>;
  columns: Record<string, Column>;
  theme: 'light' | 'dark';
  searchTerm: string;
  isLoading: boolean;
  error: string | null;
  toggleTheme: () => void;
  setSearchTerm: (term: string) => void;
  loadInitialData: () => Promise<void>;
  moveTicket: (ticketId: string, sourceColumnId: string, destColumnId: string, newIndex: number) => void;
};

export interface Props {
  column: Column;
  allTickets: Record<string, Ticket>;
  filteredTicketIds: string[];
};