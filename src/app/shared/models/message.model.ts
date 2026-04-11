export interface Message {
  user: string;
  value: string;
  origin: 'SYSTEM' | 'USER';
}
