export interface AzureTask {
  title: string;
  type: string;
  description: string;
  tags: string[];
}

export interface AzureConfig {
  organization: string;
  project: string;
  pat: string;
}