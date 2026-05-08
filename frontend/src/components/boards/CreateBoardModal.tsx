'use client';

import React, { useState } from 'react';
import { X, Layout, Type, Palette, Check, Globe, Lock } from 'lucide-react';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (boardData: { name: string, description?: string, coverColor?: string }) => void;
}

const CreateBoardModal: React.FC<CreateBoardModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('#0079BF');
  const [visibility, setVisibility] = useState<'private' | 'public'>('private');

  if (!isOpen) return null;

  const colors = [
    '#0079BF', // Blue
    '#D29034', // Orange
    '#519839', // Green
    '#B04632', // Red
    '#89609E', // Purple
    '#CD5A91', // Pink
    '#4BBF6B', // Light Green
    '#00AECC', // Teal
    '#838C91', // Grey
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({ name, description, coverColor: selectedColor });
      setName('');
      setDescription('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#0079BF]/10 rounded-lg text-[#0079BF]">
              <Layout className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Create Board</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Board Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
              <Type className="w-3 h-3" />
              Board Title
            </label>
            <input 
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter board title..."
              className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0079BF]/20 focus:bg-white rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-slate-400"
              required
            />
          </div>

          {/* Background Color Selector */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
              <Palette className="w-3 h-3" />
              Background
            </label>
            <div className="grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className="aspect-video rounded-lg transition-all hover:scale-105 relative overflow-hidden group shadow-sm"
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Visibility Toggle */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
              <Globe className="w-3 h-3" />
              Visibility
            </label>
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setVisibility('private')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${visibility === 'private' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Lock className="w-3 h-3" />
                Private
              </button>
              <button
                type="button"
                onClick={() => setVisibility('public')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${visibility === 'public' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Globe className="w-3 h-3" />
                Public
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full bg-[#0079BF] hover:bg-[#005a8e] disabled:opacity-50 disabled:hover:bg-[#0079BF] text-white py-4 rounded-xl font-black text-sm tracking-wide transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
            >
              Create Board
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed px-4">
              By creating a board, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBoardModal;
