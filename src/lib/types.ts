export interface MediaItem {
  id: number;
  storage_path: string;
  thumb_path: string;
  user: string;
  type: string;
  score: number;
}

export type MediaType = 'image' | 'video' | 'audio';
