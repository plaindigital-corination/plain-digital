
export interface WorkshopStep {
  title: string;
  description: string;
  actionItem: string;
  learningLens: string;
  whyThisMatters: string;
}

export interface WorkshopDiagnostic {
  hasIdea: boolean;
  wantsToLearnPM: boolean;
  preparingForInvestors: boolean;
}

export interface ProductConcept {
  name: string;
  targetAudience: string;
  coreProblem: string;
  opportunity: string;
  inspiration?: string;
  hypothesis?: string;
  testConcepts?: string;
  gaps?: string;
  challenges?: string;
  teamStatus?: 'solo' | 'team' | 'hiring';
  diagnostic?: WorkshopDiagnostic;
  plainSummary?: string;
  workshopSteps?: WorkshopStep[];
}

export interface JargonTranslation {
  original: string;
  plainVersion: string;
  analogy: string;
}

export interface Book {
  title: string;
  author: string;
  note: string;
  category: string;
}

export enum AppView {
  Home = 'home',
  Workshop = 'workshop',
  Translator = 'translator',
  Library = 'library',
  Connect = 'connect',
  About = 'about',
  Privacy = 'privacy'
}
