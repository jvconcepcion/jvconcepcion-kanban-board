import { useState } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragStartEvent, 
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin
} from '@dnd-kit/core';
import { useBoardStore } from '@/store/boardStore';
import { ColumnComponent } from './Column';
import { Column } from '@/types';

export function KanbanBoard() {
  const { columns, tickets, searchTerm, moveTicket } = useBoardStore();
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
        distance: 8,
    }
  }));

  function findColumnForTicket(ticketId: string): Column | undefined {
    return Object.values(columns).find(column => column.ticketIds.includes(ticketId));
  };

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const sourceColumn = findColumnForTicket(active.id as string);
    setActiveColumn(sourceColumn || null);
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || !activeColumn) {
      setActiveColumn(null);
      return;
    }

    const ticketId = active.id as string;
    const sourceColumnId = activeColumn.id;
    let destColumnId: string;

    if (columns[over.id]) {
      // Dropping on a Column
      destColumnId = over.id as string;
    } else {
      // Dropping on a Ticket
      const overTicketColumn = findColumnForTicket(over.id as string);
      if (!overTicketColumn) {
        setActiveColumn(null);
        return;
      };

      destColumnId = overTicketColumn.id;
    };

    if (!ticketId || !sourceColumnId || !destColumnId) {
      setActiveColumn(null);
      return;
    };

    const destTicketIds = columns[destColumnId]?.ticketIds || [];
    const newIndex = over.data.current?.sortable 
      ? destTicketIds.indexOf(over.id as string) 
      : destTicketIds.length;

    moveTicket(ticketId, sourceColumnId, destColumnId, newIndex); 
    setActiveColumn(null);
  };
  
  const filteredTicketIds = Object.keys(tickets).filter(id =>
    tickets[id].name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd} 
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {Object.values(columns).map(column => (
          <ColumnComponent 
            key={column.id} 
            column={column} 
            allTickets={tickets} 
            filteredTicketIds={filteredTicketIds} 
          />
        ))}
      </div>
    </DndContext>
  );
};