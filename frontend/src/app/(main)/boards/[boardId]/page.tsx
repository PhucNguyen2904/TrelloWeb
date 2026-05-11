'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getBoard, createTask, updateTask, markBoardAsViewed } from '@/lib/api';
import BoardHeader from '@/components/board/BoardHeader';
import Column from '@/components/board/Column';
import TaskCard from '@/components/board/TaskCard';
import CardDetailModal from '@/components/board/CardDetailModal';
import CreateTaskModal from '@/components/board/CreateTaskModal';
import { Plus, X } from 'lucide-react';

import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';

export default function BoardDetailPage({ params }: { params: Promise<{ boardId: string }> }) {
  const { boardId } = React.use(params);
  const queryClient = useQueryClient();
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createTarget, setCreateTarget] = useState<{ id: string, name: string } | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data: board, isLoading, isError: error } = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => getBoard(boardId),
    enabled: !!boardId,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // States for local synchronization
  const [localCards, setLocalCards] = useState<any[]>([]);
  const [localColumns, setLocalColumns] = useState<any[]>([]);
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');

  // Sync local state when board data changes
  React.useEffect(() => {
    if (board?.cards) {
      setLocalCards(board.cards);
    }
    if (board?.columns) {
      setLocalColumns(board.columns);
    }
  }, [board?.cards, board?.columns]);

  // Track last viewed board
  React.useEffect(() => {
    if (boardId) {
      markBoardAsViewed(boardId).catch(err => console.error("Failed to mark board as viewed:", err));
    }
  }, [boardId]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#00668F] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          <p className="font-bold">Loading board...</p>
        </div>
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#00668F] text-white p-6 text-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Board not found</h2>
          <p className="opacity-80">The board you are looking for does not exist or you don't have access.</p>
        </div>
      </div>
    );
  }

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: any) => {
    // Optional placeholder logic
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId !== overId) {
      setLocalCards((prev) => {
        const activeCard = prev.find(c => c.id === activeId);
        const overCard = prev.find(c => c.id === overId);
        if (!activeCard) return prev;

        if (overCard) {
          const oldIndex = prev.findIndex(c => c.id === activeId);
          const newIndex = prev.findIndex(c => c.id === overId);
          const updated = arrayMove(prev, oldIndex, newIndex);
          return updated.map(c => c.id === activeId ? { ...c, columnId: overCard.columnId } : c);
        }
        
        if (typeof overId === 'string' && overId.startsWith('col-')) {
          return prev.map(c => c.id === activeId ? { ...c, columnId: overId } : c);
        }
        return prev;
      });
    }
  };

  const handleAddList = () => {
    if (newListTitle.trim()) {
      const newList = {
        id: `col-${newListTitle.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        name: newListTitle,
        boardId: boardId
      };
      setLocalColumns([...localColumns, newList]);
      setNewListTitle('');
      setIsAddingList(false);
    }
  };

  const handleDeleteList = (columnId: string) => {
    if (window.confirm('Are you sure you want to delete this list and all its cards?')) {
      setLocalColumns(prev => prev.filter(col => col.id !== columnId));
      setLocalCards(prev => prev.filter(card => card.columnId !== columnId));
    }
  };

  const handleAddCardClick = (columnId: string, columnName: string) => {
    setCreateTarget({ id: columnId, name: columnName });
    setIsCreateOpen(true);
  };

  const handleSaveNewCard = async (taskData: any) => {
    try {
      const status = taskData.columnId.split('-')[1] || 'todo';
      await createTask(boardId, {
        title: taskData.title,
        description: taskData.description,
        status: status
      });
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
      setIsCreateOpen(false);
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  const handleCardClick = (task: any, columnName: string) => {
    setSelectedCard({
      ...task,
      columnName,
      description: task.description || "",
      members: [
        { id: '1', name: 'John Doe', avatarUrl: 'https://i.pravatar.cc/100?img=11' },
        { id: '2', name: 'Sarah Miller', avatarUrl: 'https://i.pravatar.cc/100?img=12' }
      ],
      labels: task.labels || [],
      checklists: [
        {
          title: 'Project Setup',
          items: [
            { id: '1', text: 'Define requirements', completed: true },
            { id: '2', text: 'Design UI mockups', completed: true },
            { id: '3', text: 'Setup backend API', completed: false }
          ]
        }
      ],
      comments: [
        { 
          id: '1', 
          author: 'Sarah Miller', 
          avatarUrl: 'https://i.pravatar.cc/100?img=12', 
          text: "Let's review the final checklist tomorrow.",
          time: '1 hour ago'
        }
      ]
    });
    setIsDetailOpen(true);
  };

  const columns = localColumns.map((col: any) => ({
    ...col,
    title: col.name,
    tasks: (localCards || [])
      .filter((card: any) => card.columnId === col.id)
      .map((task: any, index: number) => ({
        ...task,
        labels: task.labels || [],
        assignees: task.assignees || [],
      }))
  }));

  const defaultBg = "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=2076&auto=format&fit=crop";
  const boardBgStyle = {
    backgroundImage: `url(${board.coverUrl || defaultBg})`,
    backgroundColor: !board.coverUrl && !defaultBg ? (board.coverColor || '#0079bf') : 'transparent',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed' as const,
  };

  const handleMoveCard = (cardId: string, newListId: string) => {
    setLocalCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, columnId: newListId } : card
    ));
  };

  const handleCopyCard = (cardId: string, newListId: string, newTitle: string) => {
    const originalCard = localCards.find(c => c.id === cardId);
    if (originalCard) {
      const newCard = {
        ...originalCard,
        id: `card-${Date.now()}`,
        title: newTitle,
        columnId: newListId
      };
      setLocalCards([...localCards, newCard]);
    }
  };

  const handleSaveCard = async (cardData: any) => {
    try {
      await updateTask(boardId, cardData.id, {
        title: cardData.title,
        description: cardData.description,
        labels: cardData.labels,
        checklists: cardData.checklistItems // Map checklistItems from modal to checklists in DB
      });
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-full relative overflow-hidden" style={boardBgStyle}>
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      <div className="relative z-10 flex flex-col h-full">
        <BoardHeader boardId={boardId} boardName={board.name} isStarred={false} ownerId={board.owner_id} />
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar flex items-start gap-4 p-6 pt-2 pb-8">
            {columns.map((column: any) => (
              <Column key={column.id} title={column.title} count={column.tasks.length} onAddCard={() => handleAddCardClick(column.id, column.title)} onDelete={() => handleDeleteList(column.id)}>
                <SortableContext items={column.tasks.map((t: any) => t.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3 min-h-[10px]">
                    {column.tasks.map((task: any) => (
                      <TaskCard key={task.id} {...task} onClick={() => handleCardClick(task, column.title)} />
                    ))}
                  </div>
                </SortableContext>
              </Column>
            ))}
            {isAddingList ? (
              <div className="min-w-[280px] shrink-0 bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <input autoFocus value={newListTitle} onChange={(e) => setNewListTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddList()} placeholder="Enter list title..." className="w-full bg-white border-2 border-[#0079BF] rounded-lg px-3 py-2 text-sm focus:outline-none text-slate-800 font-medium mb-3" />
                <div className="flex items-center gap-2">
                  <button onClick={handleAddList} className="bg-[#0079BF] hover:bg-[#005a8e] text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all shadow-md active:scale-95">Add list</button>
                  <button onClick={() => setIsAddingList(false)} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-500"><X className="w-5 h-5" /></button>
                </div>
              </div>
            ) : (
              <button onClick={() => setIsAddingList(true)} className="min-w-[280px] shrink-0 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 rounded-xl h-12 flex items-center px-4 gap-2 text-white transition-all font-bold shadow-lg group">
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span>Add another list</span>
              </button>
            )}
          </div>
          <DragOverlay>
            {activeId ? (
              <div className="opacity-80 rotate-3 scale-105 pointer-events-none">
                {(() => {
                  const activeTask = localCards.find((c: any) => c.id === activeId);
                  return activeTask ? <TaskCard {...activeTask} /> : null;
                })()}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      <CardDetailModal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        card={selectedCard}
        columns={localColumns}
        onMove={handleMoveCard}
        onCopy={handleCopyCard}
        onSave={handleSaveCard}
      />
      {createTarget && (
        <CreateTaskModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSave={handleSaveNewCard} boardName={board.name} listName={createTarget.name} listId={createTarget.id} boardId={boardId} />
      )}
    </div>
  );
}
