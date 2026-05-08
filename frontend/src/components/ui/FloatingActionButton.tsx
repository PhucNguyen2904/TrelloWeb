import React from 'react';

const FloatingActionButton: React.FC = () => {
  return (
    <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary-container text-on-primary-container rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50">
      <span className="material-symbols-outlined text-3xl">add</span>
    </button>
  );
};

export default FloatingActionButton;
