export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number; // timestamp
  dueAt?: number | null; // optional timestamp
}

export enum FilterType {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED'
}
