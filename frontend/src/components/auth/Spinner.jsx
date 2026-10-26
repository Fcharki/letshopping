import React from 'react';
import { Package } from 'lucide-react';

const Spinner = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4">
        {/* Animated shopping bag icon */}
        <div className="relative">
          <Package 
            className="w-12 h-12 text-blue-500 animate-bounce" 
            strokeWidth={1.5}
          />
          {/* Circular spinner around the icon */}
          <div className="absolute inset-0 -m-2 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin" />
        </div>
        
        {/* Loading text with animated dots */}
        <div className="flex items-center gap-1 text-gray-600 font-medium">
          <span>Loading</span>
          <span className="animate-pulse">.</span>
          <span className="animate-pulse delay-100">.</span>
          <span className="animate-pulse delay-200">.</span>
        </div>
        
        {/* Progress bar */}
        <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 animate-[loading_1.5s_ease-in-out_infinite]" 
               style={{
                 width: '30%',
                 animation: 'loading 1.5s ease-in-out infinite'
               }} 
          />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default Spinner;