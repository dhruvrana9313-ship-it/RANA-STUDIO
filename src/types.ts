/**
 * Types for Rana AI Creator Studio
 */

export type ToolType =
  | 'dashboard'
  | 'title-generator'
  | 'script-writer'
  | 'thumbnail-generator'
  | 'shorts-generator'
  | 'hashtag-generator'
  | 'comment-replies'
  | 'video-description'
  | 'trending-content'
  | 'favorites'
  | 'settings';

export type LanguageType = 'english' | 'hindi' | 'hinglish';

export interface CreatorSettings {
  theme: 'light' | 'dark';
  defaultLanguage: LanguageType;
  channelName: string;
  niche: string;
}

export interface TitleIdea {
  title: string;
  engagementHook: string;
}

export interface YouTubeScript {
  hook: string;
  introduction: string;
  mainContent: { section: string; content: string }[];
  callToAction: string;
  ending: string;
}

export interface ThumbnailTextIdea {
  thumbnailText: string;
  conceptEmotion: string;
}

export interface ShortsIdea {
  idea: string;
  description: string;
  estimatedInterest: string; // e.g. "95%" or "High (92%)"
  tips: string;
}

export interface HashtagSet {
  trending: string[];
  niche: string[];
  broad: string[];
}

export interface CommentReplies {
  friendly: string;
  funny: string;
  professional: string;
  motivational: string;
}

export interface VideoDescription {
  hooks: string;
  aboutVideo: string;
  keyPoints: string[];
  timestamps: { time: string; label: string }[];
  linksAndSocials: string;
  hashtags: string[];
}

export interface TrendingIdea {
  title: string;
  trendAngle: string;
  whyItWorks: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface CreationHistoryItem {
  id: string;
  toolType: ToolType;
  timestamp: string;
  prompt: string;
  language: LanguageType;
  niche?: string;
  extraParams?: Record<string, any>;
  isFavorite: boolean;
  output: any; // Can be TitleIdea[], YouTubeScript, etc.
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
}
