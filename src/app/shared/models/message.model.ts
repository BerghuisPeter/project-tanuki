export interface Message {
  user: {
    id: string;
    displayName?: string;
    color?: string;
    avatarUrl?: string;
  };
  value: string;
  origin: 'SYSTEM' | 'USER';
  timestamp?: number;
}
