'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { StorageKeys } from '@/common/enums';
import { navItems } from '@/common/constants';
import { INavItem } from '@/common/interfaces';

interface StarredToolsContextType {
  starredToolIds: string[];
  isStarred: (toolId: string) => boolean;
  toggleStar: (toolId: string) => void;
  getStarredTools: () => INavItem[];
}

const StarredToolsContext = createContext<StarredToolsContextType | undefined>(undefined);

export function StarredToolsProvider({ children }: { children: ReactNode }) {
  const [starredToolIds, setStarredToolIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(StorageKeys.StarredTools);
    if (saved) {
      try {
        setStarredToolIds(JSON.parse(saved));
      } catch {
        setStarredToolIds([]);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(StorageKeys.StarredTools, JSON.stringify(starredToolIds));
    }
  }, [starredToolIds, isLoaded]);

  const isStarred = (toolId: string) => starredToolIds.includes(toolId);

  const toggleStar = (toolId: string) => {
    setStarredToolIds((prev) => {
      if (prev.includes(toolId)) {
        return prev.filter((id) => id !== toolId);
      }
      return [...prev, toolId];
    });
  };

  const getStarredTools = () => {
    return navItems.filter(
      (item) => starredToolIds.includes(item.id) && item.visibleOnSidebar
    );
  };

  return (
    <StarredToolsContext.Provider
      value={{ starredToolIds, isStarred, toggleStar, getStarredTools }}
    >
      {children}
    </StarredToolsContext.Provider>
  );
}

export function useStarredTools() {
  const context = useContext(StarredToolsContext);
  if (context === undefined) {
    throw new Error('useStarredTools must be used within a StarredToolsProvider');
  }
  return context;
}

