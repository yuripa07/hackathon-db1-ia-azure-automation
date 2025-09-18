export interface AzureTask {
  title: string;
  type: 'Task' | 'Bug' | 'User Story' | 'Feature';
  description: string;
  tags: string[];
}

export interface AzureConfig {
  organization: string;
  project: string;
  pat: string;
}
