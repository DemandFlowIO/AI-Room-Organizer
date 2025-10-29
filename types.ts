
export enum MessageAuthor {
  USER = 'user',
  GEMINI = 'gemini',
}

export interface ChatMessage {
  author: MessageAuthor;
  text: string;
}
