import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Ticket } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export function TicketComponent({ ticket }: { ticket: Ticket }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Calculate ticket age
  const age = formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true });

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white dark:bg-gray-700 p-3 mb-2 rounded shadow cursor-grab touch-none"
    >
      <p className="font-semibold">{ticket.name}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{ticket.description}</p>
      <div className="flex flex-wrap gap-1 mt-2">
        {ticket.tags.map(tag => (
          <span key={tag} className="text-xs bg-blue-200 dark:bg-blue-800 px-2 py-0.5 rounded-full">{tag}</span>
        ))}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{age}</p>
    </div>
  );
}