import React from 'react';

interface InputPanelProps {
  systemInstructions: string;
  setSystemInstructions: (value: string) => void;
  userPrompt: string;
  setUserPrompt: (value: string) => void;
  transcription: string;
  setTranscription: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const TranscriptionInput: React.FC<InputPanelProps> = ({
  systemInstructions,
  setSystemInstructions,
  userPrompt,
  setUserPrompt,
  transcription,
  setTranscription,
  onGenerate,
  isLoading,
}) => {
  return (
    <div className="space-y-6 flex flex-col flex-grow">
      <div>
        <label htmlFor="system-instructions" className="block text-sm font-medium text-gray-300 mb-2">
          AI System Instructions (Context)
        </label>
        <textarea
          id="system-instructions"
          value={systemInstructions}
          onChange={(e) => setSystemInstructions(e.target.value)}
          placeholder="e.g., You are a project manager for 'Project Apollo'. All tasks must be assigned to either 'Backend' or 'Frontend' teams."
          className="w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-y"
          rows={3}
          disabled={isLoading}
          aria-describedby="system-instructions-helper"
        />
        <p id="system-instructions-helper" className="text-xs text-gray-500 mt-1">These instructions are saved and applied to all future requests.</p>
      </div>

      <div>
        <label htmlFor="user-prompt" className="block text-sm font-medium text-gray-300 mb-2">
          Additional Instructions (for this time only)
        </label>
        <textarea
          id="user-prompt"
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="e.g., Focus only on action items for the marketing team and ignore technical tasks."
          className="w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-y"
          rows={2}
          disabled={isLoading}
        />
      </div>
      
      <div className="flex flex-col flex-grow">
        <label htmlFor="transcription" className="block text-sm font-medium text-gray-300 mb-2">
          Meeting Transcription
        </label>
        <textarea
          id="transcription"
          value={transcription}
          onChange={(e) => setTranscription(e.target.value)}
          placeholder="Paste your full meeting transcription here..."
          className="w-full flex-grow min-h-[16rem] p-3 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-y"
          disabled={isLoading}
          required
          aria-required="true"
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={isLoading || !transcription.trim()}
        className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex-shrink-0"
        aria-label="Generate Azure Tasks from transcription"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          'Generate Azure Tasks'
        )}
      </button>
    </div>
  );
};