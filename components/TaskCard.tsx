import React, { useState, useEffect } from 'react';
import { AzureTask, AzureConfig } from '../types';
import { sendTaskToAzure } from '../services/azureService';
import { EditIcon } from './icons/EditIcon';
import { SendIcon } from './icons/ClipboardIcon';

interface TaskCardProps {
  task: AzureTask;
  azureConfig: AzureConfig;
  isAzureConfigured: boolean;
  onUpdate: (updatedTask: AzureTask) => void;
}

const DescriptionRenderer: React.FC<{ content: string }> = ({ content }) => {
    const createMarkup = (htmlContent: string) => {
      // Basic markdown to HTML conversion for paragraphs and lists
      const formattedHtml = htmlContent
        .split('\n\n') // Split by double newlines for paragraphs
        .map(paragraph => {
          if (paragraph.trim().startsWith('* ') || paragraph.trim().startsWith('- ')) {
            const listItems = paragraph.split('\n').map(item => `<li>${item.substring(2)}</li>`).join('');
            return `<ul>${listItems}</ul>`;
          }
          return `<p>${paragraph}</p>`;
        })
        .join('');
      return { __html: formattedHtml };
    };
  
    return <div dangerouslySetInnerHTML={createMarkup(content)} />;
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, azureConfig, isAzureConfigured, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableTask, setEditableTask] = useState<AzureTask>(task);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [createdTaskLink, setCreatedTaskLink] = useState<string | null>(null);

  useEffect(() => {
    setEditableTask(task);
    // When the task prop changes (e.g., new tasks generated), reset the card's state
    setIsEditing(false);
    setIsSending(false);
    setSendError(null);
    setCreatedTaskLink(null);
  }, [task]);

  const handleSend = async () => {
    setIsSending(true);
    setSendError(null);
    setCreatedTaskLink(null);
    try {
      const result = await sendTaskToAzure(task, azureConfig);
      if (result?._links?.html?.href) {
        setCreatedTaskLink(result._links.html.href);
      } else {
        setSendError("Tarefa criada, mas não foi possível obter o link de retorno.");
      }
    } catch (error: any) {
      setSendError(error.message || 'Ocorreu um erro desconhecido ao enviar para o Azure.');
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "tags") {
      setEditableTask({ ...editableTask, tags: value.split(',').map(tag => tag.trim()) });
    } else {
      setEditableTask({ ...editableTask, [name]: value });
    }
  };

  const handleSave = () => {
    onUpdate(editableTask);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditableTask(task);
    setIsEditing(false);
  };
  
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
        case 'bug':
            return 'bg-red-900/50 text-red-300';
        case 'user story':
            return 'bg-blue-900/50 text-blue-300';
        case 'feature':
            return 'bg-purple-900/50 text-purple-300';
        case 'task':
             return 'bg-yellow-900/50 text-yellow-300';
        default:
            return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <div className="bg-gray-800/70 border border-gray-700 rounded-lg p-5 shadow-md transition-shadow hover:shadow-lg hover:border-gray-600">
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-400">Título</label>
            <input
              type="text"
              name="title"
              value={editableTask.title}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400">Tipo</label>
            <input
              type="text"
              name="type"
              value={editableTask.type}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400">Descrição (Markdown)</label>
            <textarea
              name="description"
              value={editableTask.description}
              onChange={handleInputChange}
              rows={6}
              className="w-full mt-1 p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400">Tags (separadas por vírgula)</label>
            <input
              type="text"
              name="tags"
              value={editableTask.tags.join(', ')}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button onClick={handleCancel} className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-700 transition">Cancelar</button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition">Salvar</button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
                <span className={`text-xs ${getTypeColor(task.type)} px-2 py-1 rounded-full font-medium`}>{task.type}</span>
                <h3 className="text-xl font-bold mt-2 text-blue-300">{task.title}</h3>
            </div>
            <div className="flex space-x-2 flex-shrink-0 items-center min-h-[40px]">
                {createdTaskLink ? (
                  <a 
                    href={createdTaskLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center px-3 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition"
                    aria-label={`Ver tarefa no Azure DevOps`}
                  >
                    Ver no Azure
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </a>
                ) : isSending ? (
                  <div className="text-sm text-blue-400 flex items-center px-2">
                    <svg className="animate-spin mr-2 h-4 w-4 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </div>
                ) : (
                  <>
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition"
                        aria-label="Editar tarefa"
                    >
                        <EditIcon className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={handleSend} 
                        disabled={!isAzureConfigured}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Enviar para o Azure DevOps"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                  </>
                )}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-400">Descrição</h4>
            <div className="prose prose-sm prose-invert mt-1 max-w-none text-gray-300 p-3 bg-gray-900/50 rounded-md space-y-2">
                <DescriptionRenderer content={task.description} />
            </div>
          </div>

          {task.tags.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-400">Tags</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {task.tags.map((tag, i) => (
                  <span key={i} className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {sendError && 
            <p className="text-sm text-red-400 mt-2">
              <strong>Erro:</strong> {sendError}
            </p>
          }
        </div>
      )}
    </div>
  );
};
