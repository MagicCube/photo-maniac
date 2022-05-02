import cn from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import type { Photo } from '@/types';

import { CategorySelector } from '../CategorySelector';
import { FeatureSelector } from '../FeatureSelector';

import { MainMenuIcon } from './MainMenuIcon';
import { RecentPhotosPage } from './RecentPhotosPage';

export interface MainMenuProps {
  feature: string;
  categories: number[];
  isUpdating: boolean;
  onFeatureChange: (feature: string) => void;
  onCategoriesChange: (categories: number[]) => void;
  onPhotoSelect: (photo: Photo) => void;
  onUpdateClick: () => void;
}

export function MainMenu({
  feature: featureFromProp,
  categories: categoriesFromProp,
  isUpdating,
  onFeatureChange,
  onCategoriesChange,
  onPhotoSelect,
  onUpdateClick,
}: MainMenuProps) {
  const [active, setActive] = useState(false);
  const [feature, setFeature] = useState(featureFromProp);
  const [categories, setCategories] = useState<number[]>(categoriesFromProp);
  const [page, setPage] = useState<string>('home');
  useEffect(() => {
    setFeature(featureFromProp);
  }, [featureFromProp]);
  useEffect(() => {
    setCategories(categoriesFromProp);
  }, [categoriesFromProp]);
  const mainMenuDropdownRef = useRef<HTMLDivElement>(null);
  const handleNavigateHome = useCallback(() => {
    setPage('home');
  }, []);
  const handleBodyClick = useCallback(function (
    this: HTMLElement,
    e: MouseEvent
  ) {
    if (
      mainMenuDropdownRef.current &&
      !mainMenuDropdownRef.current.contains(e.target as Node)
    ) {
      setActive(false);
      document.body.removeEventListener('click', handleBodyClick, true);
    }
  },
  []);
  const handleIconClick = useCallback(() => {
    const newActiveState = !active;
    setActive(newActiveState);
    if (newActiveState) {
      setPage('home');
      document.body.addEventListener('click', handleBodyClick, true);
    }
  }, [active, handleBodyClick]);
  const handleFeatureChanged = useCallback(
    (value: string) => {
      setFeature(value);
      onFeatureChange(value);
    },
    [onFeatureChange]
  );
  const handleCategoryChanged = useCallback(
    (values: number[]) => {
      setCategories(values);
      onCategoriesChange(values);
    },
    [onCategoriesChange]
  );
  useEffect(() => {
    if (localStorage['pm.firstRun'] !== 'false') {
      localStorage['pm.firstRun'] = 'false';
      handleIconClick();
    }
  }, [handleIconClick]);
  const handleShowRecentPhotos = () => {
    setPage('recent-photos');
  };
  return (
    <div className="pm-main-menu">
      <div>
        <MainMenuIcon active={active} onClick={handleIconClick} />
      </div>
      <div
        ref={mainMenuDropdownRef}
        className={cn('pm-main-menu-dropdown', active && 'active')}
      >
        {page === 'home' ? (
          <div>
            <section>
              <h3>Features</h3>
              <FeatureSelector
                value={feature}
                onChange={handleFeatureChanged}
              />
            </section>
            <section>
              <h3>Categories</h3>
              <CategorySelector
                values={categories}
                onChange={handleCategoryChanged}
              />
            </section>
            <footer>
              <div className="left">
                <button
                  className="large primary button"
                  disabled={isUpdating}
                  onClick={() => {
                    onUpdateClick();
                  }}
                >
                  {isUpdating ? 'Updating...' : 'Update Now'}
                </button>
              </div>
              <div className="right">
                <a onClick={handleShowRecentPhotos}>Show recent photos</a>
              </div>
            </footer>
          </div>
        ) : (
          <RecentPhotosPage
            onNavigateHome={handleNavigateHome}
            onPhotoSelect={onPhotoSelect}
          />
        )}
      </div>
    </div>
  );
}
