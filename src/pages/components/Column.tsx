import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Props } from '@/types';
import { TicketComponent } from './Ticket';

export function ColumnComponent({ column, allTickets, filteredTicketIds }: Props) {
  const { setNodeRef } = useDroppable({ id: column.id });

  const ticketsInColumn = column.ticketIds
    .map(id => allTickets[id])
    .filter(ticket => ticket && filteredTicketIds.includes(ticket.id));

  const ticketIdsInColumn = ticketsInColumn.map(t => t.id);

  return (
    <div ref={setNodeRef} className="bg-gray-200 dark:bg-gray-800 rounded-lg p-2 flex flex-col">
      <h2 className="font-bold text-lg p-2">{column.name} ({ticketsInColumn.length}/{column.limit})</h2>
      <div className="flex-grow min-h-[200px]">
        <SortableContext items={ticketIdsInColumn} strategy={verticalListSortingStrategy}>
          {ticketsInColumn.map(ticket => (
            <TicketComponent key={ticket.id} ticket={ticket} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};