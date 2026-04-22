'use client';

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

interface CreateBoardModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onCreate: (boardName: string) => void;
  onClose: () => void;
}

export function CreateBoardModal({ isOpen, isLoading, onCreate, onClose }: CreateBoardModalProps) {
  const [boardName, setBoardName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (boardName.trim()) {
      onCreate(boardName.trim());
      setBoardName("");
    }
  };

  const handleClose = () => {
    setBoardName("");
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        />
      )}

      {/* Modal */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
        >
          <div className="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Plus className="w-6 h-6 text-indigo-500" />
                Create a New Board
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="board-name" className="block text-sm font-medium text-gray-300 mb-2">
                    Board Name
                  </label>
                  <input
                    id="board-name"
                    type="text"
                    autoFocus
                    placeholder="e.g., Q3 Planning"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value.slice(0, 100))}
                    maxLength={100}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-indigo-500 text-white placeholder-gray-500 transition-colors"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {boardName.length}/100 characters
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={!boardName.trim() || isLoading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    {isLoading ? 'Creating...' : 'Create Board'}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
