import React, { useState } from 'react';
import { AzureTask, AzureConfig } from '../types';
import { sendTaskToAzure } from '../services/azureService';
import { SendIcon } from './icons/ClipboardIcon';

interface TaskCardProps {
  task: AzureTask;
  azureConfig: AzureConfig;
  isAzureConfigured: boolean;
}

type SendState = 'idle' | 'sending' | 'success' | 'error';

const getTypeColor = (type: AzureTask['type']): string => {
  switch (type) {
    case 'Bug':
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    case 'User Story':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'Feature':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    case 'Task':
    default:
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, azureConfig, isAzureConfigured }) => {
  const [sendState, setSendState] = useState<SendState>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const handleSend = async () => {
    if (!isAzureConfigured) return;
    
    setSendState('sending');
    setError(null);

    try {
      await sendTaskToAzure(task, azureConfig);
      setSendState('success');
    } catch (err) {
      setSendState('error');
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    }
  };

  const renderButtonContent = () => {
    switch (sendState) {
      case 'sending':
        return (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </>
        );
      case 'success':
        return 'Sent!';
      case 'error':
        return 'Retry';
      case 'idle':
      default:
        return (
          <>
            <SendIcon className="h-5 w-5 mr-2"/>
            Send to Azure
          </>
        );
    }
  }

  return (
    <div className={`bg-gray-800/50 border border-gray-700 rounded-lg shadow-md transition-all duration-300 ${sendState === 'success' ? 'border-green-500/50' : 'hover:border-blue-500/50 hover:shadow-blue-500/10'}`}>
      <div className="p-5">
        <div className="flex justify-between items-start">
            <div className="flex-grow pr-4">
                <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(task.type)}`}>
                        {task.type}
                    </span>
                    <h3 className="text-lg font-bold text-gray-100">{task.title}</h3>
                </div>
            </div>
          <button 
            onClick={handleSend} 
            disabled={!isAzureConfigured || sendState === 'sending' || sendState === 'success'}
            className="flex-shrink-0 flex items-center justify-center px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-sm font-medium text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-600/50 disabled:cursor-not-allowed disabled:text-gray-400"
            >
            {renderButtonContent()}
          </button>
        </div>
        <p className="mt-2 text-gray-400 whitespace-pre-wrap">{task.description}</p>
        {task.tags && task.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {task.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs font-medium rounded-md">
                {tag}
              </span>
            ))}
          </div>
        )}
        {sendState === 'error' && (
            <p className="mt-3 text-sm text-red-400 bg-red-900/40 p-3 rounded-md">
                <strong>Error:</strong> {error}
            </p>
        )}
      </div>
    </div>
  );
};