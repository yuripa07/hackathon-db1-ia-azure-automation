import React from 'react';
import { AzureIcon } from './icons/AzureIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-blue-500/30 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <AzureIcon className="h-8 w-8 mr-3 text-blue-400" />
        <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
          Gerador de Tarefas Azure com IA
        </h1>
      </div>
    </header>
  );
};