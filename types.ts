
export interface Student {
  id: string;
  fullName: string;
  className: string;
  dob: string;
  createdAt?: string;
}

export enum Tab {
  ADD = 'ADD',
  LIST = 'LIST',
  DASHBOARD = 'DASHBOARD',
  SETUP = 'SETUP'
}

export interface SheetConfig {
  webAppUrl: string;
}
