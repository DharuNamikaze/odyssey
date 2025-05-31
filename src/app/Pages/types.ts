export interface Page {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  isPublic: boolean;
  parentId?: string; // For nested pages
  icon?: string;
  coverImage?: string;
}

export interface Block {
  id: string;
  type: 'text' | 'heading' | 'image' | 'code' | 'bullet' | 'numbered' | 'toggle' | 'quote';
  content: string;
  pageId: string;
  position: number;
  props?: Record<string, any>; // For additional block-specific properties
}