import React from 'react';
import { AzureTask, AzureConfig } from '../types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: AzureTask[];
  azureConfig: AzureConfig;
  isAzureConfigured: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, azureConfig, isAzureConfigured }) => {
  return (
    <div className="space-y-4">
      {!isAzureConfigured && tasks.length > 0 && (
         <div className="p-4 bg-yellow-900/50 border border-yellow-700 text-yellow-300 rounded-lg text-center">
            Please configure your Azure DevOps details to send tasks.
        </div>
      )}
      {tasks.map((task, index) => (
        <TaskCard 
          key={index} 
          task={task} 
          azureConfig={azureConfig}
          isAzureConfigured={isAzureConfigured}
        />
      ))}
    </div>
  );
};
