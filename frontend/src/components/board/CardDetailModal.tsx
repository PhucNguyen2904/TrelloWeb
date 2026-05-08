'use client';

import React from 'react';
import { 
  X, 
  Layout, 
  User, 
  Tag, 
  CheckSquare, 
  Clock, 
  Paperclip, 
  MoveRight, 
  Copy, 
  Share2, 
  Archive,
  AlignLeft,
  List,
  Plus
} from 'lucide-react';
import Image from 'next/image';

interface CardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  isCreate?: boolean;
  onSave?: (cardData: any) => void;
  card: {
    id?: string;
    title: string;
    columnName: string;
    description?: string;
    members?: { id: string; avatarUrl: string; name: string }[];
    labels?: { name: string; color: string; textColor?: string }[];
    checklists?: { 
      title: string; 
      items: { id: string; text: string; completed: boolean }[] 
    }[];
    comments?: { id: string; author: string; avatarUrl: string; text: string; time: string }[];
  } | null;
  columns?: { id: string; name: string }[];
  onMove?: (cardId: string, newListId: string) => void;
  onCopy?: (cardId: string, newListId: string, newTitle: string) => void;
}

const CardDetailModal: React.FC<CardDetailModalProps> = ({ isOpen, onClose, card, columns = [], onMove, onCopy }) => {
  const [title, setTitle] = React.useState(card?.title || '');
  const [description, setDescription] = React.useState(card?.description || '');
  const [comment, setComment] = React.useState('');
  const [checklistItems, setChecklistItems] = React.useState(card?.checklists?.[0]?.items || []);
  const [newChecklistItem, setNewChecklistItem] = React.useState('');
  const [labels, setLabels] = React.useState(card?.labels || []);
  const [members, setMembers] = React.useState(card?.members || []);
  const [dueDate, setDueDate] = React.useState<string | null>(null);
  const [activePopover, setActivePopover] = React.useState<string | null>(null);
  const [destinationListId, setDestinationListId] = React.useState<string>('');

  React.useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || '');
      setChecklistItems(card.checklists?.[0]?.items || []);
      setLabels(card.labels || []);
      setMembers(card.members || []);
      if (columns.length > 0) setDestinationListId(columns[0].id);
    }
  }, [card, columns]);

  if (!isOpen || !card) return null;

  const handleMove = () => {
    if (onMove && card.id) {
      onMove(card.id, destinationListId);
      onClose();
    }
  };

  const handleCopy = () => {
    if (onCopy && card.id) {
      onCopy(card.id, destinationListId, `${title} (Copy)`);
      onClose();
    }
  };

  const toggleLabel = (labelName: string, color: string) => {
    setLabels(prev => {
      const exists = prev.find(l => l.name === labelName);
      if (exists) {
        return prev.filter(l => l.name !== labelName);
      }
      return [...prev, { name: labelName, color }];
    });
  };

  const toggleMember = (name: string, id: string) => {
    setMembers(prev => {
      const exists = prev.find(m => m.id === id);
      if (exists) {
        return prev.filter(m => m.id !== id);
      }
      return [...prev, { id, name, avatarUrl: `https://i.pravatar.cc/100?img=${parseInt(id) + 20}` }];
    });
  };

  const handleSaveDate = () => {
    setDueDate("May 12, 2026"); // Mocking date selection
    setActivePopover(null);
  };

  const toggleChecklistItem = (id: string) => {
    setChecklistItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        text: newChecklistItem,
        completed: false
      };
      setChecklistItems([...checklistItems, newItem]);
      setNewChecklistItem('');
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      console.log('Submit comment:', comment);
      setComment('');
    }
  };

  // Calculate checklist progress
  const totalItems = checklistItems.length;
  const completedItems = checklistItems.filter(i => i.completed).length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-xl shadow-2xl flex flex-col overflow-hidden relative border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 shrink-0 bg-white border-b border-slate-50">
          <div className="flex items-start gap-4 flex-1">
            <Layout className="w-6 h-6 text-[#0079BF] mt-1" />
            <div className="flex-1 mr-4">
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold text-slate-900 leading-tight w-full bg-transparent border-none focus:ring-0 p-0 transition-all outline-none"
                placeholder="Card title..."
              />
              <p className="text-xs text-slate-500 mt-1 font-medium">
                in list <span className="underline cursor-pointer hover:text-[#0079BF] transition-colors">{card.columnName}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden min-h-0 relative">
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar bg-white">
            {/* Badges section */}
            <div className="flex flex-wrap gap-10">
              {/* Members */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">MEMBERS</h4>
                <div className="flex gap-2 items-center">
                  {members.map((member) => (
                    <div key={member.id} className="relative w-8 h-8 group">
                      <img 
                        src={member.avatarUrl} 
                        alt={member.name} 
                        className="h-8 w-8 rounded-full cursor-pointer ring-2 ring-transparent hover:ring-[#0079BF] transition-all" 
                        title={member.name}
                      />
                    </div>
                  ))}
                  <button 
                    onClick={() => setActivePopover('members')}
                    className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all text-slate-600 group"
                  >
                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Labels */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">LABELS</h4>
                <div className="flex gap-2 items-center flex-wrap">
                  {labels.map((label, idx) => (
                    <span 
                      key={idx} 
                      className={`px-3 py-1.5 rounded font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer hover:brightness-95 ${label.color} ${label.textColor || 'text-white'}`}
                      onClick={() => setActivePopover('labels')}
                    >
                      {label.name}
                    </span>
                  ))}
                  <button 
                    onClick={() => setActivePopover('labels')}
                    className="h-7 w-7 rounded bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all text-slate-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Due Date Badge */}
              {dueDate && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">DUE DATE</h4>
                  <div 
                    onClick={() => setActivePopover('dates')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-all border border-slate-200"
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-xs font-bold text-slate-700">{dueDate}</span>
                    <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded uppercase font-black tracking-tighter">On Time</span>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <AlignLeft className="w-5 h-5 text-slate-500" />
                <h3 className="font-bold text-slate-900 text-lg">Description</h3>
              </div>
              <div className="pl-9">
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a more detailed description..."
                  className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white p-4 rounded-xl cursor-text transition-all text-slate-700 text-sm border-2 border-transparent focus:border-[#0079BF]/20 min-h-[120px] resize-none outline-none"
                />
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CheckSquare className="w-5 h-5 text-slate-500" />
                  <h3 className="font-bold text-slate-900 text-lg">Checklist</h3>
                </div>
                <button className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded text-xs font-bold transition-all text-slate-600">Delete</button>
              </div>
              <div className="pl-9 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500 font-black w-8">{Math.round(progress)}%</span>
                  <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#0079BF] h-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(0,121,191,0.4)]" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <ul className="space-y-1">
                  {checklistItems.map((item) => (
                    <li key={item.id} className="flex items-center gap-3 group p-2 hover:bg-slate-50 rounded-lg transition-colors">
                      <input 
                        type="checkbox" 
                        checked={item.completed} 
                        onChange={() => toggleChecklistItem(item.id)}
                        className="h-5 w-5 rounded border-slate-300 text-[#0079BF] focus:ring-[#0079BF]/20 cursor-pointer transition-all"
                      />
                      <span className={`text-sm font-medium transition-all ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="flex gap-2">
                  <input 
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()}
                    placeholder="Add an item..."
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#0079BF]/20 outline-none transition-all"
                  />
                  <button 
                    onClick={addChecklistItem}
                    className="px-4 py-2 bg-[#0079BF] text-white rounded-lg text-sm font-bold hover:bg-[#005a8e] transition-all shadow-md active:scale-95"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Activity */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <List className="w-5 h-5 text-slate-500" />
                  <h3 className="font-bold text-slate-900 text-lg">Activity</h3>
                </div>
                <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-xs font-bold transition-all text-slate-600">Show details</button>
              </div>

              <form onSubmit={handleCommentSubmit} className="flex gap-4">
                <div className="h-9 w-9 rounded-full bg-[#0079BF] flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm">JD</div>
                <div className="flex-1 space-y-2">
                  <input 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0079BF]/20 focus:border-transparent shadow-sm outline-none transition-all" 
                    placeholder="Write a comment..." 
                  />
                  {comment.trim() && (
                    <button type="submit" className="bg-[#0079BF] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#005a8e] transition-all">Save</button>
                  )}
                </div>
              </form>

              {/* Comment Feed */}
              <div className="space-y-8 pl-1">
                {card.comments?.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <img src={comment.avatarUrl} alt={comment.author} className="h-9 w-9 rounded-full shadow-sm" />
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">{comment.author}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{comment.time}</span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none text-sm text-slate-700 leading-relaxed shadow-sm border border-slate-100">
                        {comment.text}
                      </div>
                      <div className="flex gap-4 text-[10px] font-black text-slate-400 px-1">
                        <button className="hover:text-[#0079BF] transition-colors uppercase tracking-widest">Edit</button>
                        <button className="hover:text-red-600 transition-colors uppercase tracking-widest">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="w-64 p-8 space-y-8 bg-slate-50/50 border-l border-slate-100 shrink-0 hidden md:block overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ADD TO CARD</h4>
              <div className="space-y-2 relative">
                <ActionButton 
                  icon={<User className="w-4 h-4" />} 
                  label="Members" 
                  onClick={() => setActivePopover(activePopover === 'members' ? null : 'members')}
                />
                <ActionButton 
                  icon={<Tag className="w-4 h-4" />} 
                  label="Labels" 
                  onClick={() => setActivePopover(activePopover === 'labels' ? null : 'labels')}
                />
                <ActionButton 
                  icon={<CheckSquare className="w-4 h-4" />} 
                  label="Checklist" 
                  onClick={() => setActivePopover(activePopover === 'checklist' ? null : 'checklist')}
                />
                <ActionButton 
                  icon={<Clock className="w-4 h-4" />} 
                  label="Dates" 
                  onClick={() => setActivePopover(activePopover === 'dates' ? null : 'dates')}
                />
                <ActionButton icon={<Paperclip className="w-4 h-4" />} label="Attachments" />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ACTIONS</h4>
              <div className="space-y-2">
                <ActionButton 
                  icon={<MoveRight className="w-4 h-4" />} 
                  label="Move" 
                  onClick={() => setActivePopover('move')}
                />
                <ActionButton 
                  icon={<Copy className="w-4 h-4" />} 
                  label="Copy" 
                  onClick={() => setActivePopover('copy')}
                />
                <ActionButton 
                  icon={<Share2 className="w-4 h-4" />} 
                  label="Share" 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Card link copied to clipboard!');
                  }}
                />
                <ActionButton 
                  icon={<Archive className="w-4 h-4" />} 
                  label="Archive" 
                  colorClass="bg-red-50 hover:bg-red-100 text-red-600" 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to archive this card?')) {
                      onClose();
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Popover Menu */}
          {activePopover && (
            <div className="absolute top-24 right-64 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-[60] animate-in slide-in-from-right-4 duration-200">
              <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-2">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{activePopover}</h4>
                <button onClick={() => setActivePopover(null)}><X className="w-4 h-4 text-slate-400 hover:text-slate-600" /></button>
              </div>
              
              {(activePopover === 'move' || activePopover === 'copy') && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Select Destination List</label>
                    <select 
                      value={destinationListId}
                      onChange={(e) => setDestinationListId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2.5 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-[#0079BF]/20 outline-none appearance-none cursor-pointer"
                    >
                      {columns.map((col) => (
                        <option key={col.id} value={col.id}>{col.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <button 
                    onClick={activePopover === 'move' ? handleMove : handleCopy}
                    className="w-full bg-[#0079BF] text-white py-2.5 rounded-lg text-xs font-black shadow-lg shadow-blue-100 hover:brightness-110 transition-all active:scale-[0.98]"
                  >
                    {activePopover === 'move' ? 'Move Card' : 'Copy Card'}
                  </button>
                </div>
              )}
              
              {activePopover === 'labels' && (
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
                      className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer group justify-between"
                    >
                      <div className={`flex-1 h-8 rounded flex items-center px-3 text-[10px] font-black text-white uppercase tracking-wider ${label.color}`}>
                        {label.name}
                      </div>
                      {labels.find(l => l.name === label.name) && (
                        <div className="w-4 h-4 bg-[#5aac44] rounded-full flex items-center justify-center">
                          <Plus className="w-3 h-3 text-white rotate-45" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activePopover === 'members' && (
                <div className="space-y-3">
                  <input className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#0079BF]/20 outline-none" placeholder="Search members..." />
                  <div className="space-y-1">
                    {[
                      { name: 'John Doe', id: '11' },
                      { name: 'Sarah Miller', id: '12' },
                      { name: 'Alex Rivers', id: '13' }
                    ].map((m, i) => (
                      <div 
                        key={i} 
                        onClick={() => toggleMember(m.name, m.id)}
                        className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#0079BF] flex items-center justify-center text-white text-[10px] font-black">{m.name.split(' ').map(n => n[0]).join('')}</div>
                          <span className="text-xs font-bold text-slate-700">{m.name}</span>
                        </div>
                        {members.find(member => member.id === m.id) && (
                          <div className="w-4 h-4 bg-[#5aac44] rounded-full flex items-center justify-center">
                            <Plus className="w-3 h-3 text-white rotate-45" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activePopover === 'dates' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl text-center border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Selected Date</p>
                    <p className="text-sm font-black text-slate-900">May 12, 2026</p>
                  </div>
                  <button 
                    onClick={handleSaveDate}
                    className="w-full bg-[#0079BF] text-white py-2.5 rounded-lg text-xs font-black shadow-lg shadow-blue-100 hover:brightness-110 transition-all"
                  >
                    Save Date
                  </button>
                  <button 
                    onClick={() => { setDueDate(null); setActivePopover(null); }}
                    className="w-full text-rose-600 py-1 text-[10px] font-black uppercase tracking-widest hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ icon, label, onClick, colorClass = "bg-slate-100 hover:bg-slate-200 text-slate-700" }: { icon: React.ReactNode, label: string, onClick?: () => void, colorClass?: string }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 ${colorClass} rounded text-sm font-medium transition-colors`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default CardDetailModal;
