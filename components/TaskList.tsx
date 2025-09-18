import React from 'react';
import { AzureTask, AzureConfig } from '../types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: AzureTask[];
  azureConfig: AzureConfig;
  isAzureConfigured: boolean;
  onUpdateTask: (index: number, updatedTask: AzureTask) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, azureConfig, isAzureConfigured, onUpdateTask }) => {
  return (
    <div className="space-y-4">
      {!isAzureConfigured && tasks.length > 0 && (
         <div className="p-4 bg-yellow-900/50 border border-yellow-700 text-yellow-300 rounded-lg text-center">
            Por favor, configure os detalhes do seu Azure DevOps para poder enviar as tarefas.
        </div>
      )}
      {tasks.map((task, index) => (
        <TaskCard 
          key={index} 
          task={task} 
          azureConfig={azureConfig}
          isAzureConfigured={isAzureConfigured}
          onUpdate={(updatedTask) => onUpdateTask(index, updatedTask)}
        />
      ))}
    </div>
  );
};