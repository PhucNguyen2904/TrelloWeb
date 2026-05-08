'use client';

import React, { useState } from 'react';
import { 
  X, 
  Layout, 
  User, 
  Tag, 
  CheckSquare, 
  Clock, 
  Paperclip, 
  AlignLeft,
  List,
  Type,
  Italic,
  Bold,
  ListIcon,
  Link2,
  ChevronDown,
  UploadCloud,
  Plus
} from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: any) => void;
  boardName: string;
  listName: string;
  listId: string;
  boardId: string;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  boardName, 
  listName,
  listId,
  boardId 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [checklistItems, setChecklistItems] = useState<string[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<{ name: string, color: string }[]>([]);
  const [activePopover, setActivePopover] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!title.trim()) return;
    onSave({
      title,
      description,
      columnId: listId,
      boardId,
      labels: selectedLabels
    });
    setTitle('');
    setDescription('');
    setSelectedLabels([]);
    onClose();
  };

  const toggleLabel = (labelName: string, color: string) => {
    setSelectedLabels(prev => {
      const exists = prev.find(l => l.name === labelName);
      if (exists) {
        return prev.filter(l => l.name !== labelName);
      } else {
        return [...prev, { name: labelName, color }];
      }
    });
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklistItems([...checklistItems, newChecklistItem]);
      setNewChecklistItem('');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-xl shadow-2xl flex flex-col overflow-hidden relative border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0">
          <h2 className="text-lg font-bold text-slate-900">Create New Task</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white">
            {/* Task Title */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Task Title</label>
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold text-slate-900 leading-tight w-full bg-transparent border-none focus:ring-0 p-0 transition-colors outline-none"
                placeholder="Enter task title..."
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <AlignLeft className="w-5 h-5 text-slate-500" />
                <h3 className="font-bold text-slate-900">Description</h3>
              </div>
              <div className="border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#0079BF]/20 transition-all">
                <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/50">
                  <ToolbarButton icon={<Bold className="w-4 h-4" />} />
                  <ToolbarButton icon={<Italic className="w-4 h-4" />} />
                  <div className="w-px h-4 bg-slate-200 mx-1" />
                  <ToolbarButton icon={<ListIcon className="w-4 h-4" />} />
                  <ToolbarButton icon={<Link2 className="w-4 h-4" />} />
                </div>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a more detailed description..."
                  className="w-full p-4 text-sm text-slate-700 min-h-[120px] bg-white border-none focus:ring-0 resize-none outline-none"
                />
              </div>
            </div>

            {/* Assignees & Labels */}
            <div className="flex flex-wrap gap-x-8 gap-y-6">
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">ASSIGNEES</h4>
                <div className="flex gap-2 items-center">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    Assign
                  </button>
                  <div className="w-8 h-8 rounded-full bg-[#0079BF] flex items-center justify-center text-white text-[10px] font-bold">AR</div>
                </div>
              </div>
              <div className="space-y-3 relative">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">LABELS</h4>
                <div className="flex flex-wrap gap-2 items-center">
                  {selectedLabels.map((label, idx) => (
                    <div 
                      key={idx} 
                      className={`h-8 px-3 rounded flex items-center text-[10px] font-black text-white uppercase tracking-wider shadow-sm transition-all hover:brightness-110 cursor-pointer ${label.color}`}
                      onClick={() => toggleLabel(label.name, label.color)}
                    >
                      {label.name}
                    </div>
                  ))}
                  <button 
                    onClick={() => setActivePopover(activePopover === 'labels' ? null : 'labels')}
                    className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded transition-colors text-slate-600"
                    title="Add labels"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Labels Popover */}
                {activePopover === 'labels' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-[100] animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-2">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Labels</h4>
                      <button onClick={() => setActivePopover(null)}><X className="w-4 h-4 text-slate-400 hover:text-slate-600" /></button>
                    </div>
                    <div className="space-y-2">
                      {[
                        { name: 'High Priority', color: 'bg-rose-500' },
                        { name: 'Design', color: 'bg-purple-500' },
                        { name: 'Frontend', color: 'bg-blue-500' },
                        { name: 'Backend', color: 'bg-emerald-500' }
                      ].map((label, i) => (
                        <div 
                          key={i} 
                          onClick={() => toggleLabel(label.name, label.color)}
                          className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded-lg cursor-pointer group"
                        >
                          <div className={`flex-1 h-8 rounded flex items-center px-3 text-[10px] font-black text-white uppercase tracking-wider transition-all group-hover:brightness-110 ${label.color}`}>
                            {label.name}
                          </div>
                          {selectedLabels.find(l => l.name === label.name) && (
                            <div className="w-4 h-4 bg-[#5aac44] rounded-full flex items-center justify-center shrink-0">
                              <Plus className="w-3 h-3 text-white rotate-45" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckSquare className="w-5 h-5 text-slate-500" />
                  <h3 className="font-bold text-slate-900">Checklist</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">0%</span>
              </div>
              <div className="bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#0079BF] h-full w-0 transition-all duration-500"></div>
              </div>
              <div className="flex gap-2">
                <input 
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()}
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#0079BF]/20 outline-none"
                  placeholder="Add an item..."
                />
                <button 
                  onClick={addChecklistItem}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-all"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Attachments */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Paperclip className="w-5 h-5 text-slate-500" />
                <h3 className="font-bold text-slate-900">Attachments</h3>
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-5 h-5 text-[#0079BF]" />
                </div>
                <p className="text-sm font-bold text-slate-900">Drag and drop files here</p>
                <p className="text-xs text-slate-500 mt-1">or click to browse from your computer</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-64 p-6 space-y-6 bg-slate-50/50 border-l border-slate-100 shrink-0 overflow-y-auto custom-scrollbar">
            {/* Location */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">LOCATION</h4>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Board</label>
                  <div className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 cursor-pointer hover:border-slate-300 transition-all">
                    <div className="flex items-center gap-2">
                      <Layout className="w-4 h-4 text-[#0079BF]" />
                      <span className="truncate max-w-[120px]">{boardName}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">List</label>
                  <div className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 cursor-pointer hover:border-slate-300 transition-all">
                    <span>{listName}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">DATES</h4>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-slate-300 transition-all">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Dates</span>
              </button>
            </div>

            {/* Save as template */}
            <div className="pt-4 border-t border-slate-200">
              <div className="bg-white p-4 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Save as template</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Reuse this task setup</p>
                </div>
                <div className="relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-200 transition-colors duration-200 ease-in-out focus:outline-none">
                  <span className="translate-x-0 pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-white shrink-0">
          <button 
            onClick={onClose}
            className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors px-4 py-2"
          >
            Cancel
          </button>
          <button 
            onClick={handleCreate}
            disabled={!title.trim()}
            className="px-10 py-3 rounded-lg font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2"
            style={{ 
              backgroundColor: title.trim() ? '#5aac44' : '#ebecf0',
              color: title.trim() ? '#ffffff' : '#a5adba',
              cursor: title.trim() ? 'pointer' : 'not-allowed',
              opacity: 1
            }}
          >
            <Plus className="w-5 h-5" style={{ color: title.trim() ? '#ffffff' : '#a5adba' }} />
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
};

const ToolbarButton = ({ icon }: { icon: React.ReactNode }) => (
  <button className="p-1.5 hover:bg-slate-200/50 rounded transition-colors text-slate-600">
    {icon}
  </button>
);

export default CreateTaskModal;
