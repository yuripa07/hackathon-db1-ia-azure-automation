import React from 'react';

interface InputPanelProps {
  systemInstructions: string;
  setSystemInstructions: (value: string) => void;
  taskType: string;
  setTaskType: (value: string) => void;
  transcription: string;
  setTranscription: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const TranscriptionInput: React.FC<InputPanelProps> = ({
  systemInstructions,
  setSystemInstructions,
  taskType,
  setTaskType,
  transcription,
  setTranscription,
  onGenerate,
  isLoading,
}) => {
  return (
    <div className="space-y-6 flex flex-col flex-grow">
      <div>
        <label htmlFor="system-instructions" className="block text-sm font-medium text-gray-300 mb-2">
          Modelo da Tarefa (Contexto para IA)
        </label>
        <textarea
          id="system-instructions"
          value={systemInstructions}
          onChange={(e) => setSystemInstructions(e.target.value)}
          placeholder="Ex: Você é um gerente de projetos. As tarefas devem seguir o padrão: Título conciso, Descrição detalhada em markdown, e Tags relevantes como 'Backend' ou 'Frontend'."
          className="w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-y"
          rows={3}
          disabled={isLoading}
          aria-describedby="system-instructions-helper"
        />
        <p id="system-instructions-helper" className="text-xs text-gray-500 mt-1">Estas instruções são salvas e aplicadas a todas as futuras solicitações.</p>
      </div>

      <div>
        <label htmlFor="task-type" className="block text-sm font-medium text-gray-300 mb-2">
          Tipo do Item de Trabalho
        </label>
        <input
          id="task-type"
          type="text"
          value={taskType}
          onChange={(e) => setTaskType(e.target.value)}
          placeholder="Ex: Task, Bug, Impediment, PBI"
          className="w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          disabled={isLoading}
          required
        />
      </div>

      <div className="flex flex-col flex-grow">
        <label htmlFor="transcription" className="block text-sm font-medium text-gray-300 mb-2">
          Detalhes do Card
        </label>
        <textarea
          id="transcription"
          value={transcription}
          onChange={(e) => setTranscription(e.target.value)}
          placeholder="Insira os detalhes para a criação do card aqui..."
          className="w-full flex-grow min-h-[16rem] p-3 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-y"
          disabled={isLoading}
          required
          aria-required="true"
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={isLoading || !transcription.trim() || !taskType.trim()}
        className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex-shrink-0"
        aria-label="Gerar Tarefas do Azure a partir dos detalhes"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Gerando...
          </>
        ) : (
          'Gerar Tarefa do Azure'
        )}
      </button>
    </div>
  );
};