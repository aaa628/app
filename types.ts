
export type DisagreementMode = 
  | 'logical' 
  | 'devils-advocate' 
  | 'future-you' 
  | 'worst-case' 
  | 'probability' 
  | 'falsification';

export interface ThoughtEntry {
  id: string;
  text: string;
  confidence: number;
  mode: DisagreementMode;
  timestamp: number;
  response?: string[];
  reflection?: ReflectionType;
  reflectionNote?: string;
}

export type ReflectionType = 
  | 'disagree' 
  | 'exposed' 
  | 'need-evidence' 
  | 'changing-mind';

export interface ModeConfig {
  id: DisagreementMode;
  label: string;
  icon: string;
  description: string;
  systemPrompt: string;
}
