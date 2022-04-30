import cn from 'classnames';
import { useEffect, useState } from 'react';

import { CategoryList } from '../CategoryList';

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
  const handleCategoryListSelectionsChanged = (selections: number[]) => {
    setSelectedCategories(selections);
    onSelectedCategoriesChanged(selections);
  };
  return (
    <div className="pm-main-menu">
      <div>
        <MainMenuIcon active={active} onClick={handleIconClick} />
      </div>
      <div className={cn('pm-main-menu-dropdown', active && 'active')}>
        <h3>Categories</h3>
        <CategoryList
          selections={selectedCategories}
          onSelectionsChanged={handleCategoryListSelectionsChanged}
        />
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
