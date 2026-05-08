import React from 'react';

interface BoardCanvasProps {
  children: React.ReactNode;
  backgroundImage?: string;
}

const BoardCanvas: React.FC<BoardCanvasProps> = ({ children, backgroundImage }) => {
  const defaultBg = "url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2000)";
  
  return (
    <main 
      className="flex-1 md:ml-sidebar_width h-[calc(100vh-topbar)] overflow-hidden flex flex-col"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), ${backgroundImage || defaultBg}`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {children}
    </main>
  );
};

export default BoardCanvas;
