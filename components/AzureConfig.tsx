import React from 'react';
import { AzureConfig as AzureConfigType } from '../types';

interface AzureConfigProps {
    config: AzureConfigType;
    setConfig: (config: AzureConfigType) => void;
    isDisabled: boolean;
}

export const AzureConfig: React.FC<AzureConfigProps> = ({ config, setConfig, isDisabled }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfig({
            ...config,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-4">
             <h2 className="text-xl font-semibold text-gray-200">Configuração do Azure DevOps</h2>
            <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-300 mb-2">
                    Nome da Organização
                </label>
                <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={config.organization}
                    onChange={handleChange}
                    disabled={isDisabled}
                    placeholder="Ex: 'sua-org'"
                    className="w-full p-2 bg-gray-800 border-2 border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
            </div>
            <div>
                <label htmlFor="project" className="block text-sm font-medium text-gray-300 mb-2">
                    Nome do Projeto
                </label>
                <input
                    type="text"
                    id="project"
                    name="project"
                    value={config.project}
                    onChange={handleChange}
                    disabled={isDisabled}
                    placeholder="Ex: 'MeuProjeto'"
                    className="w-full p-2 bg-gray-800 border-2 border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
            </div>
            <div>
                <label htmlFor="pat" className="block text-sm font-medium text-gray-300 mb-2">
                    Personal Access Token (PAT)
                </label>
                <input
                    type="password"
                    id="pat"
                    name="pat"
                    value={config.pat}
                    onChange={handleChange}
                    disabled={isDisabled}
                    placeholder="Insira seu PAT com permissões de leitura/escrita para itens de trabalho"
                    className="w-full p-2 bg-gray-800 border-2 border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    aria-describedby="pat-helper"
                />
                 <p id="pat-helper" className="text-xs text-gray-500 mt-2">
                    Seu PAT é armazenado no armazenamento local do seu navegador e não é enviado para nenhum outro lugar, exceto diretamente para o Azure DevOps. 
                    <a href="https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">Aprenda a criar um PAT.</a>
                </p>
            </div>
        </div>
    );
};