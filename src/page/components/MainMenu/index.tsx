import cn from 'classnames';
import { useEffect, useState } from 'react';

import { CategorySelector } from '../CategorySelector';

import { MainMenuIcon } from './MainMenuIcon';

export interface MainMenuProps {
  selections: number[];
  onSelectedCategoriesChanged: (categories: number[]) => void;
  onUpdateClick: () => void;
}

export function MainMenu({
  selections: selectionsFromProp,
  onSelectedCategoriesChanged,
  onUpdateClick: onUpdate,
}: MainMenuProps) {
  const [active, setActive] = useState(false);
  const [selectedCategories, setSelectedCategories] =
    useState<number[]>(selectionsFromProp);
  useEffect(() => {
    setSelectedCategories(selectionsFromProp);
  }, [selectionsFromProp]);
  const handleIconClick = () => {
    setActive(!active);
  };
  const handleCategorySelectorChanged = (selections: number[]) => {
    setSelectedCategories(selections);
    onSelectedCategoriesChanged(selections);
  };
  return (
    <div className="pm-main-menu">
      <div>
        <MainMenuIcon active={active} onClick={handleIconClick} />
      </div>
      <div className={cn('pm-main-menu-dropdown', active && 'active')}>
        <h2>Photo Maniac</h2>
        <hr />
        <section>
          <h3>Categories</h3>
          <CategorySelector
            selections={selectedCategories}
            onSelectionsChanged={handleCategorySelectorChanged}
          />
        </section>
        <div>
          <button
            className="large primary button"
            onClick={() => {
              onUpdate();
            }}
          >
            Update Now
          </button>
        </div>
      </div>
    </div>
  );
}
