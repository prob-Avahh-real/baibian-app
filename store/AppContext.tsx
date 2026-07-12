import React, { createContext, useContext, useReducer, useCallback } from 'react';

export interface Template {
  id: string;
  name: string;
  category: string;
  gradient: [string, string];
  emoji: string;
  description: string;
}

export interface TransformResult {
  id: string;
  templateId: string;
  templateName: string;
  originalUri: string;
  resultUri: string;
  createdAt: number;
}

interface AppState {
  templates: Template[];
  selectedTemplate: Template | null;
  userPhotoUri: string | null;
  results: TransformResult[];
  isTransforming: boolean;
}

type Action =
  | { type: 'SELECT_TEMPLATE'; payload: Template }
  | { type: 'SET_PHOTO'; payload: string }
  | { type: 'ADD_RESULT'; payload: TransformResult }
  | { type: 'SET_TRANSFORMING'; payload: boolean }
  | { type: 'DELETE_RESULT'; payload: string }
  | { type: 'CLEAR_PHOTO' };

export const TEMPLATES: Template[] = [
  {
    id: 'celebrity',
    name: '明星大咖',
    category: '明星',
    gradient: ['#F59E0B', '#EF4444'],
    emoji: '🌟',
    description: '变身顶流明星，闪耀全场',
  },
  {
    id: 'ancient',
    name: '古装风华',
    category: '古风',
    gradient: ['#8B5CF6', '#EC4899'],
    emoji: '🏯',
    description: '穿越千年，一袭华服',
  },
  {
    id: 'anime',
    name: '动漫次元',
    category: '二次元',
    gradient: ['#06B6D4', '#3B82F6'],
    emoji: '🎭',
    description: '打破次元壁，变身动漫角色',
  },
  {
    id: 'retro',
    name: '复古港风',
    category: '复古',
    gradient: ['#F97316', '#EF4444'],
    emoji: '📻',
    description: '回到黄金年代，港风十足',
  },
  {
    id: 'hiphop',
    name: '嘻哈街头',
    category: '潮流',
    gradient: ['#14B8A6', '#8B5CF6'],
    emoji: '🎤',
    description: '街头潮流，态度全开',
  },
  {
    id: 'business',
    name: '职场精英',
    category: '职场',
    gradient: ['#3B82F6', '#1D4ED8'],
    emoji: '💼',
    description: '精英气质，一手拿捏',
  },
  {
    id: 'fantasy',
    name: '奇幻魔法',
    category: '奇幻',
    gradient: ['#A855F7', '#6366F1'],
    emoji: '🔮',
    description: '魔法世界的神秘魅力',
  },
  {
    id: 'sport',
    name: '运动达人',
    category: '运动',
    gradient: ['#22C55E', '#16A34A'],
    emoji: '⚽',
    description: '活力四射的运动风采',
  },
];

const initialState: AppState = {
  templates: TEMPLATES,
  selectedTemplate: null,
  userPhotoUri: null,
  results: [],
  isTransforming: false,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SELECT_TEMPLATE':
      return { ...state, selectedTemplate: action.payload };
    case 'SET_PHOTO':
      return { ...state, userPhotoUri: action.payload };
    case 'CLEAR_PHOTO':
      return { ...state, userPhotoUri: null };
    case 'ADD_RESULT':
      return {
        ...state,
        results: [action.payload, ...state.results],
        isTransforming: false,
      };
    case 'DELETE_RESULT':
      return {
        ...state,
        results: state.results.filter((r) => r.id !== action.payload),
      };
    case 'SET_TRANSFORMING':
      return { ...state, isTransforming: action.payload };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  selectTemplate: (template: Template) => void;
  setPhoto: (uri: string) => void;
  clearPhoto: () => void;
  addResult: (result: TransformResult) => void;
  deleteResult: (id: string) => void;
  setTransforming: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const selectTemplate = useCallback(
    (template: Template) => dispatch({ type: 'SELECT_TEMPLATE', payload: template }),
    []
  );
  const setPhoto = useCallback(
    (uri: string) => dispatch({ type: 'SET_PHOTO', payload: uri }),
    []
  );
  const clearPhoto = useCallback(
    () => dispatch({ type: 'CLEAR_PHOTO' }),
    []
  );
  const addResult = useCallback(
    (result: TransformResult) => dispatch({ type: 'ADD_RESULT', payload: result }),
    []
  );
  const deleteResult = useCallback(
    (id: string) => dispatch({ type: 'DELETE_RESULT', payload: id }),
    []
  );
  const setTransforming = useCallback(
    (v: boolean) => dispatch({ type: 'SET_TRANSFORMING', payload: v }),
    []
  );

  return (
    <AppContext.Provider
      value={{
        state,
        selectTemplate,
        setPhoto,
        clearPhoto,
        addResult,
        deleteResult,
        setTransforming,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
