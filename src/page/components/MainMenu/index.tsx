import cn from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import type { Photo } from '@/types';

import { CategorySelector } from '../CategorySelector';
import { FeatureSelector } from '../FeatureSelector';

import { GalleryMenuIcon, MainMenuIcon } from './icons';
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
  const [mainMenuActive, setMainMenuActive] = useState(false);
  const [galleryActive, setGalleryActive] = useState(false);
  const [feature, setFeature] = useState(featureFromProp);
  const [categories, setCategories] = useState<number[]>(categoriesFromProp);
  useEffect(() => {
    setFeature(featureFromProp);
  }, [featureFromProp]);
  useEffect(() => {
    setCategories(categoriesFromProp);
  }, [categoriesFromProp]);
  const mainMenuDropdownRef = useRef<HTMLDivElement>(null);
  const handleBodyClick = useCallback(function (
    this: HTMLElement,
    e: MouseEvent
  ) {
    if (
      mainMenuDropdownRef.current &&
      !mainMenuDropdownRef.current.contains(e.target as Node)
    ) {
      setMainMenuActive(false);
      setGalleryActive(false);
      document.body.removeEventListener('click', handleBodyClick, true);
    }
  },
  []);
  const handleMainMenuClick = useCallback(() => {
    const newActiveState = !mainMenuActive;
    setMainMenuActive(newActiveState);
    if (newActiveState) {
      setGalleryActive(false);
      document.body.addEventListener('click', handleBodyClick, true);
    }
  }, [mainMenuActive, handleBodyClick]);
  const handleGalleryClick = useCallback(() => {
    const newActiveState = !galleryActive;
    setGalleryActive(newActiveState);
    if (newActiveState) {
      setMainMenuActive(false);
      document.body.addEventListener('click', handleBodyClick, true);
    }
  }, [galleryActive, handleBodyClick]);
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
      handleMainMenuClick();
    }
  }, [handleMainMenuClick]);
  return (
    <div className="pm-main-menu">
      <div className="pm-icons">
        <GalleryMenuIcon active={galleryActive} onClick={handleGalleryClick} />
        <MainMenuIcon active={mainMenuActive} onClick={handleMainMenuClick} />
      </div>
      <div
        ref={mainMenuDropdownRef}
        className={cn(
          'pm-main-menu-dropdown',
          (mainMenuActive || galleryActive) && 'active',
          galleryActive && 'gallery'
        )}
      >
        {mainMenuActive ? (
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
            </footer>
          </div>
        ) : (
          <RecentPhotosPage onPhotoSelect={onPhotoSelect} />
        )}
      </div>
    </div>
  );
}
