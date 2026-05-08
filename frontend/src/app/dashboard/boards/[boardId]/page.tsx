'use client';

import React, { useState } from 'react';
import BoardHeader from '@/components/board/BoardHeader';
import Column from '@/components/board/Column';
import TaskCard from '@/components/board/TaskCard';
import { Plus, X } from 'lucide-react';

export default function BoardDetailPage({ params }: { params: { boardId: string } }) {
  const [isAddingCard, setIsAddingCard] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState('');

  // Mock data matching the new design requirements
  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      color: 'bg-purple-500',
      tasks: [
        {
          id: '1',
          title: 'Setup development environment and CI/CD pipelines',
          labels: [
            { name: 'Design', color: 'bg-red-100', textColor: 'text-red-700' },
            { name: 'Frontend', color: 'bg-yellow-100', textColor: 'text-yellow-700' }
          ],
          priority: 'High' as const,
          dueDate: 'Dec 15',
          checklists: { done: 2, total: 5 },
          commentsCount: 3,
          assignees: ['https://i.pravatar.cc/100?img=1', 'https://i.pravatar.cc/100?img=2']
        },
        {
          id: '2',
          title: 'Analyze competitor pricing strategies',
          labels: [{ name: 'Research', color: 'bg-blue-100', textColor: 'text-blue-700' }],
          priority: 'Medium' as const,
          dueDate: 'Dec 20',
          assignees: ['https://i.pravatar.cc/100?img=3']
        }
      ]
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      color: 'bg-yellow-500',
      tasks: [
        {
          id: '3',
          title: 'Implement responsive navbar and mobile drawer',
          coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=500',
          labels: [{ name: 'Frontend', color: 'bg-indigo-100', textColor: 'text-indigo-700' }],
          priority: 'High' as const,
          dueDate: 'Dec 10',
          isOverdue: true,
          checklists: { done: 8, total: 10 },
          commentsCount: 12,
          assignees: ['https://i.pravatar.cc/100?img=4', 'https://i.pravatar.cc/100?img=5']
        }
      ]
    },
    {
      id: 'testing',
      title: 'Testing',
      color: 'bg-blue-500',
      tasks: []
    },
    {
      id: 'done',
      title: 'Done',
      color: 'bg-green-500',
      tasks: [
        {
          id: '4',
          title: 'OAuth2 Integration with Google',
          isCompleted: true,
          labels: [{ name: 'Auth', color: 'bg-green-100', textColor: 'text-green-700' }],
          assignees: ['https://i.pravatar.cc/100?img=6']
        }
      ]
    }
  ];

  const handleAddCard = (columnId: string) => {
    setIsAddingCard(columnId);
  };

  const cancelAddCard = () => {
    setIsAddingCard(null);
    setNewCardTitle('');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#00668F]"> {/* Teal/Slate background */}
      <BoardHeader boardName="Project Alpha" isStarred={true} />
      
      <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar flex items-start gap-6 p-6">
        {columns.map((column) => (
          <Column 
            key={column.id} 
            title={column.title} 
            color={column.color}
            count={column.tasks.length}
            onAddCard={() => handleAddCard(column.id)}
          >
            {column.tasks.map((task) => (
              <TaskCard key={task.id} {...task} />
            ))}

            {isAddingCard === column.id && (
              <div className="bg-white p-3 rounded-xl shadow-md border border-slate-200 animate-in fade-in zoom-in duration-200">
                <textarea
                  autoFocus
                  placeholder="Enter card title..."
                  className="w-full text-sm border-none focus:ring-0 p-0 mb-3 min-h-[60px] resize-none text-slate-800"
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      // Submit logic here
                      cancelAddCard();
                    }
                  }}
                />
                <div className="flex items-center gap-2">
                  <button 
                    className="bg-[#1976D2] hover:bg-[#1565C0] text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm transition-all"
                    onClick={cancelAddCard}
                  >
                    Add card
                  </button>
                  <button 
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                    onClick={cancelAddCard}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </Column>
        ))}

        {/* Add List Button (Ghost) */}
        <button className="min-w-[300px] h-12 flex items-center gap-2 px-4 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white font-bold transition-all shrink-0">
          <Plus className="w-5 h-5" />
          <span>Add another list</span>
        </button>
      </div>
    </div>
  );
}
