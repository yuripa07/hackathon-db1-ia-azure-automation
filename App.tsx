import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { AzureConfig } from './components/AzureConfig';
import { TranscriptionInput } from './components/TranscriptionInput';
import { TaskList } from './components/TaskList';
import { Loader } from './components/Loader';
import { AzureTask, AzureConfig as AzureConfigType } from './types';
import { generateTasksFromTranscription } from './services/geminiService';

const App: React.FC = () => {
  const [systemInstructions, setSystemInstructions] = useState<string>(() => {
    return localStorage.getItem('geminiAzureTaskGenerator-systemInstructions') || '';
  });
  const [taskType, setTaskType] = useState<string>('Task');
  const [transcription, setTranscription] = useState<string>('');
  const [tasks, setTasks] = useState<AzureTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [azureConfig, setAzureConfig] = useState<AzureConfigType>(() => {
    const savedConfig = localStorage.getItem('geminiAzureTaskGenerator-azureConfig');
    return savedConfig ? JSON.parse(savedConfig) : { organization: '', project: '', pat: '' };
  });

  useEffect(() => {
    localStorage.setItem('geminiAzureTaskGenerator-systemInstructions', systemInstructions);
  }, [systemInstructions]);
  
  useEffect(() => {
    localStorage.setItem('geminiAzureTaskGenerator-azureConfig', JSON.stringify(azureConfig));
  }, [azureConfig]);

  const handleGenerateTasks = useCallback(async () => {
    if (!transcription.trim()) {
      setError('Por favor, insira os detalhes do card.');
      return;
    }
    if (!taskType.trim()) {
      setError('Por favor, especifique o tipo do item de trabalho.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTasks([]);

    try {
      const generatedTasks = await generateTasksFromTranscription(transcription, systemInstructions, taskType);
      setTasks(generatedTasks);
    } catch (err) {
      console.error(err);
      setError('Falha ao gerar tarefas. Por favor, verifique sua chave de API e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [transcription, systemInstructions, taskType]);

  const handleUpdateTask = (index: number, updatedTask: AzureTask) => {
    const newTasks = [...tasks];
    newTasks[index] = updatedTask;
    setTasks(newTasks);
  };

  const isAzureConfigured = !!(azureConfig.organization && azureConfig.project && azureConfig.pat);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:gap-12">

          {/* Left Column: Input */}
          <div className="lg:w-1/2 flex flex-col space-y-8">
            <AzureConfig config={azureConfig} setConfig={setAzureConfig} isDisabled={isLoading} />
            <TranscriptionInput
              systemInstructions={systemInstructions}
              setSystemInstructions={setSystemInstructions}
              taskType={taskType}
              setTaskType={setTaskType}
              transcription={transcription}
              setTranscription={setTranscription}
              onGenerate={handleGenerateTasks}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column: Output */}
          <div className="lg:w-1/2 mt-10 lg:mt-0 flex flex-col">
            <h2 className="text-2xl font-semibold mb-6 flex-shrink-0">Tarefas Geradas</h2>
            
            <div className="flex-grow flex flex-col">
                {error && (
                  <div className="p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center">
                    {error}
                  </div>
                )}

                {isLoading && <Loader />}

                {!isLoading && tasks.length > 0 && 
                    <TaskList 
                        tasks={tasks} 
                        azureConfig={azureConfig} 
                        isAzureConfigured={isAzureConfigured}
                        onUpdateTask={handleUpdateTask} 
                    />
                }
                
                {!isLoading && tasks.length === 0 && !error && (
                    <div className="flex-grow flex items-center justify-center rounded-lg border-2 border-dashed border-gray-700 p-8 text-center text-gray-500 min-h-[200px]">
                        <p>Suas tarefas geradas para o Azure DevOps aparecerão aqui.</p>
                    </div>
                )}
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-gray-600 text-sm">
        <p>Desenvolvido com Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;