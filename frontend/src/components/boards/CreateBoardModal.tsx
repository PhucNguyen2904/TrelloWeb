'use client';

import React, { useState } from 'react';
import { X, Layout, Type, Palette, Check, Globe, Lock } from 'lucide-react';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (boardData: { name: string, description?: string, color?: string, gradient?: string }) => void;
}

const CreateBoardModal: React.FC<CreateBoardModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('navyBlue');
  const [visibility, setVisibility] = useState<'private' | 'public'>('private');

  if (!isOpen) return null;

  const colorSwatches = [
    { key: 'navyBlue',       g: 'linear-gradient(135deg,#0f1f6e,#1a3a8f,#2563eb)' },
    { key: 'burntAmber',     g: 'linear-gradient(135deg,#7c3a00,#b85c00,#d4820a)' },
    { key: 'forestDeep',     g: 'linear-gradient(135deg,#1a3a0f,#2d6a1f,#3d8b2e)' },
    { key: 'deepRust',       g: 'linear-gradient(135deg,#7f1d1d,#b91c1c,#f97316)' },
    { key: 'midnightPurple', g: 'linear-gradient(135deg,#1e0533,#581c87,#a855f8)' },
    { key: 'roseDark',       g: 'linear-gradient(135deg,#4a0522,#9f1239,#f43f5e)' },
    { key: 'jungleMoss',     g: 'linear-gradient(135deg,#1a2e05,#365314,#84cc16)' },
    { key: 'arcticMint',     g: 'linear-gradient(135deg,#082f49,#0369a1,#22d3ee)' },
    { key: 'slateMetal',     g: 'linear-gradient(135deg,#0f172a,#334155,#64748b)' },
  ];

  const gradientPresets: Record<string, string> = {
    navyBlue:       'linear-gradient(135deg,#0f1f6e 0%,#1a3a8f 45%,#2563eb 100%)',
    burntAmber:     'linear-gradient(135deg,#7c3a00 0%,#b85c00 45%,#d4820a 100%)',
    forestDeep:     'linear-gradient(135deg,#1a3a0f 0%,#2d6a1f 45%,#3d8b2e 100%)',
    deepRust:       'linear-gradient(135deg,#7f1d1d 0%,#b91c1c 45%,#f97316 100%)',
    midnightPurple: 'linear-gradient(135deg,#1e0533 0%,#581c87 45%,#a855f8 100%)',
    roseDark:       'linear-gradient(135deg,#4a0522 0%,#9f1239 45%,#f43f5e 100%)',
    jungleMoss:     'linear-gradient(135deg,#1a2e05 0%,#365314 45%,#84cc16 100%)',
    arcticMint:     'linear-gradient(135deg,#082f49 0%,#0369a1 45%,#22d3ee 100%)',
    slateMetal:     'linear-gradient(135deg,#0f172a 0%,#334155 45%,#64748b 100%)',
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleCreateBoard();
  };

  const handleCreateBoard = () => {
    if (name.trim()) {
      onSave({ 
        name, 
        description, 
        color: selectedColor,
        gradient: gradientPresets[selectedColor] ?? gradientPresets['navyBlue']
      });
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
            <div className="grid grid-cols-3 gap-3">
              {colorSwatches.map(swatch => (
                <div
                  key={swatch.key}
                  onClick={() => setSelectedColor(swatch.key)}
                  style={{
                    width: '100%',
                    height: 48,
                    borderRadius: 8,
                    background: swatch.g,
                    cursor: 'pointer',
                    border: selectedColor === swatch.key
                      ? '3px solid #fff'
                      : '2px solid transparent',
                    boxShadow: selectedColor === swatch.key
                      ? '0 0 0 2px #2563eb'
                      : 'none',
                    transition: 'all 0.15s ease',
                  }}
                  className="relative"
                >
                  {selectedColor === swatch.key && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
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
              type="button"
              onClick={handleCreateBoard}
              disabled={!name.trim()}
              className="w-full py-2 rounded-lg font-medium text-white transition-all"
              style={{
                background: 'linear-gradient(135deg, #1e40af 0%, #1d9e6e 100%)',
                opacity: name.trim() ? 1 : 0.5,
                cursor: name.trim() ? 'pointer' : 'not-allowed',
              }}
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
