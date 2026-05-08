'use client';

import React, { useState } from 'react';
import ProjectFlowNavbar from '@/components/layout/ProjectFlowNavbar';
import ProjectFlowSidebar from '@/components/layout/ProjectFlowSidebar';
import BoardCanvas from '@/components/board/BoardCanvas';
import BoardHeader from '@/components/board/BoardHeader';
import Column from '@/components/board/Column';
import TaskCard from '@/components/board/TaskCard';

export default function BoardPage() {
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const mockTasks = {
    todo: [
      {
        id: 1,
        title: "Refresh the hero section illustrations with new 3D assets",
        labels: [{ name: 'Design', color: 'bg-blue-100', textColor: 'text-blue-700' }],
        priority: 'High' as const,
        commentsCount: 3,
        attachments: 2,
        checklists: { done: 4, total: 5 },
        assignees: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDBQCs1z3NjFpaQncW8ZtK5dJYpdJ4dI1WulnsTvgqOLhNjC8Xu4_K95WyoKlI5cBBcvQG6Uat_kVUpvx_ihAxh0XSDb6rneXiJLXOfAtsh7Wl8ld32hmNolrEJqni7OrBiYWK11a46HRswk6BnFXKSF1F2KmrWVNbjKjjM9KTJoGX8o5WWez1svuuGA2d-aVfKcszuPBLGyg63oqHv1dqdQMDrWShxEaLhEJ7HksZ7QNP8KkrYvQjRONTyK5sCkptcwLo_O7fWjeI'],
        description: "We need to replace the current 2D flat illustrations in the hero section with the new 3D character assets provided by the design team. The goal is to make the landing page feel more modern and premium."
      },
      {
        id: 2,
        title: "Prepare branding guide for the new landing page",
        labels: [{ name: 'Marketing', color: 'bg-pink-100', textColor: 'text-pink-700' }],
        dueDate: "May 5",
        isOverdue: true,
        coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCP0JbVVs91vZDtrl1HNfqfVJ-w9kJNW3awqSUZFnekikOK4SNG_Qkpq9jOGBIiGd0297yoM0UBNtsY6fU6EmFDJhMYO5Q2RoWcufRr2H5EX0qffTnOT95cYTwCsIFUFgUSzPw9ovuXQLU014aAl2zOcia4BVOo3NqhqLvVxMrM15aXGBhop8E6QuPREU3lZQpBF2-zVW6TBN6pMwKILqCrlNlLhxDHnmn1hfg-kqSS6hQxjzzsnbFy6C0-pbhlRPk9aVSeMlgNpB8",
        assignees: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCTRI5mdpePujmGBmnEdR9a5r6qAiwXA-7b09fpwlAT6bXXdTareWt5mW3ZhSct3yu1P2HV38BDjkF43Z7i83DWNUbPwAo4pD-H5ZND1IoViOeHx7vaCP3JtbWdH1vGfNt7mTaLGpAZjWsGx4ekQwK5UOYpT83GiMR0ht8F3uq-6kaMleRN8TbgjeWEWoM5XA81E42cONWRS9cXisshWNlU_Yzrh-dnuSCfjkWnQsqGzKuofPQYx5BbUBQRZR44Q3Bk0UHN6OagSVo'],
      }
    ],
    inProgress: [
      {
        id: 3,
        title: "Implement responsive navbar and mobile drawer",
        labels: [{ name: 'Frontend', color: 'bg-indigo-100', textColor: 'text-indigo-700' }],
        priority: 'Medium' as const,
        dueDate: "May 12",
        commentsCount: 8,
        assignees: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuA8YG6AIe1rLEEXO-S4UP1ULjBaLPP0Z8lcHMlzYJiEDh51ekkw-YTXZ07e8icriexG-OR7dJ8pZ0zyWrH06BMiPUAgLn9XjyKkAID3Ba0k4p8eZvNYoikV8ADmaQYLfEstOL4JZKxqSZlH1WfV3x1jDtS8xMn6g7f_BDnZRb6UXyydIz_Nvk271iVHmv2HbTNzxjFcwEY314CY3RDfXNg6gckobmicZwpKCaur2SEhZvGiviORmSJRItxLhOPNZg9FCLzzT8SYI4k',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDSJMWAw9Fk72l22kMovV3fbkQe3OCqfIgjT0o9TRk1BT01jK7O6VyjyX3W6oEpi80BLjl1Eryu8YPhMSnP9-7yFq4DmTiiztS3yR7UYShuMxeJuJkVlv4WZ8fVIsT5E1MnySPFYY52D1hhRoFwtcQqTOqH0_N1-fjjI2Xo2dzveAo8IcIt33o6v-_2PB2SHtm2mBW00p8clS_KaThVt4jgVwmLvoMNVDpMDGmuqwSyZ23d154fGveFFJJR3PIt7ygBcIWHNlnMDHQ'
        ],
      }
    ],
    done: [
      {
        id: 4,
        title: "Analyze competitor pricing strategies",
        labels: [{ name: 'Research', color: 'bg-slate-100', textColor: 'text-slate-500' }],
        isCompleted: true,
        assignees: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDOOc3BI_cJPi_8Uo2gKj1SD04KQaF7x0FNWlBIoZ2XDW5YMB6sZhAcpy6OkbYJu2DCtW8oDM3TUwHLvkyFe5Ujln8OExcVrsxefSFfdaY8O1iRySu_Eg0v7j_9heL0Z_ezjuAr_iTFCJKO_9YVzSqew0ebDCOjirb85AHo4UnF4rEVtLA8qJU9AWNgnSlYVRsitAeNmH6GKbVgPm_odhapD6-HOOP25DptcdVVQ1lEJ_sDWXmgLC-m4vjYCKdjtkvFtRxCgpme-m4'],
      }
    ]
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <ProjectFlowNavbar />
      
      <div className="flex flex-1 overflow-hidden">
        <ProjectFlowSidebar />
        
        <main className="flex-1 flex flex-col min-w-0">
          <BoardHeader workspaceName="Engineering Team" boardName="Website Redesign" />
          
          <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar bg-slate-50 p-6 flex gap-6 items-start">
            <Column title="To Do" icon="📋" count={mockTasks.todo.length}>
              {mockTasks.todo.map(task => (
                <TaskCard key={task.id} {...task} onClick={() => setSelectedTask(task)} />
              ))}
            </Column>

            <Column title="In Progress" icon="🔄" count={mockTasks.inProgress.length}>
              {mockTasks.inProgress.map(task => (
                <TaskCard key={task.id} {...task} onClick={() => setSelectedTask(task)} />
              ))}
            </Column>

            <Column title="In Review" icon="👀" count={0} />

            <Column title="Done" icon="✅" count={mockTasks.done.length}>
              {mockTasks.done.map(task => (
                <TaskCard key={task.id} {...task} onClick={() => setSelectedTask(task)} />
              ))}
            </Column>

            <div className="shrink-0">
              <button className="w-[320px] p-4 flex items-center gap-3 text-slate-500 hover:text-[#0079BF] hover:bg-slate-100 rounded-xl border-2 border-dashed border-slate-200 transition-all shadow-sm hover:shadow active:scale-95">
                <span className="material-symbols-outlined">add</span>
                <span className="font-bold">Add another list</span>
              </button>
            </div>
          </div>
        </main>

        {/* Task Detail Sidebar */}
        {selectedTask && (
          <aside className="w-[450px] border-l border-slate-200 bg-white flex flex-col shrink-0 animate-in slide-in-from-right duration-300 shadow-2xl z-40">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500">dock_to_right</span>
                <span className="font-semibold text-slate-700">Card Details</span>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors" onClick={() => setSelectedTask(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              <section>
                <div className="flex items-start gap-3 mb-6">
                  <span className="material-symbols-outlined mt-1 text-slate-400">title</span>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-slate-900 mb-1 leading-tight">{selectedTask.title}</h2>
                    <p className="text-sm text-slate-500">in list <span className="underline font-medium cursor-pointer hover:text-[#0079BF]">To Do</span></p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 ml-9 mb-8">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Members</h4>
                    <div className="flex items-center gap-1">
                      {selectedTask.assignees?.map((src: string, i: number) => (
                        <img key={i} className="w-8 h-8 rounded-full shadow-sm" src={src} alt="User" />
                      ))}
                      <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                        <span className="material-symbols-outlined text-lg">add</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Labels</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedTask.labels?.map((l: any, i: number) => (
                        <span key={i} className={`px-3 py-1 rounded text-xs font-bold ${l.color} ${l.textColor}`}>{l.name}</span>
                      ))}
                      <button className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                        <span className="material-symbols-outlined text-lg">add</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined mt-1 text-slate-400">notes</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-slate-700">Description</h3>
                      <button className="text-xs font-bold text-slate-500 hover:text-[#0079BF] bg-slate-100 px-2 py-1 rounded">Edit</button>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 leading-relaxed border border-transparent hover:border-slate-200 cursor-pointer transition-all">
                      {selectedTask.description || "No description provided."}
                    </div>
                  </div>
                </div>
              </section>

              {selectedTask.checklists && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-400">check_box</span>
                      <h3 className="font-bold text-slate-700">Tasks Checklist</h3>
                    </div>
                  </div>
                  <div className="ml-9">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-bold text-slate-500 w-8 text-right">
                        {Math.round((selectedTask.checklists.done / selectedTask.checklists.total) * 100)}%
                      </span>
                      <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-green-500 h-full transition-all duration-500" 
                          style={{ width: `${(selectedTask.checklists.done / selectedTask.checklists.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-slate-400">chat</span>
                  <h3 className="font-bold text-slate-700">Activity</h3>
                </div>
                <div className="flex gap-3 mb-8">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">UN</div>
                  <div className="flex-1">
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#0079BF] focus:border-transparent outline-none transition-all" 
                      rows={2} 
                      placeholder="Write a comment..."
                    ></textarea>
                  </div>
                </div>
              </section>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
