import { type ReactNode } from 'react';

interface MemeGridProps {
  children: ReactNode;
  title?: string;
}

const MemeGrid = ({ children, title }: MemeGridProps) => {
  return (
    <section className="space-y-6">
      {title && (
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-black text-black bg-gradient-to-r from-lime-400 to-green-400 px-6 py-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block">
            {title}
          </h2>
          <div className="flex-1 h-1 bg-gradient-to-r from-lime-400 to-transparent rounded-full" />
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {children}
      </div>
    </section>
  );
};

export default MemeGrid;
