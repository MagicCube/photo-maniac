import cn from 'classnames';
import { useEffect, useState } from 'react';

import { ALL_CATEGORIES } from '@/data/all-categories';

import { PhotoCategoryIcon } from './PhotoCategoryIcon';

export interface PhotoCategorySelectorProps {
  selections: number[];
  onChange: (selections: number[]) => void;
  onUpdate: () => void;
}

export function PhotoCategorySelector({
  selections: selectionsFromProp,
  onChange,
  onUpdate,
}: PhotoCategorySelectorProps) {
  const [dropDownVisible, setDroppedDownVisible] = useState(false);
  const [selections, setSelections] = useState<number[]>(selectionsFromProp);
  useEffect(() => {
    setSelections(selectionsFromProp);
  }, [selectionsFromProp]);
  const handleCategoryIconClick = () => {
    setDroppedDownVisible(!dropDownVisible);
  };
  const handleCategoryChange = (id: number) => {
    let results: number[];
    if (selections.includes(id)) {
      results = selections.filter((selection) => selection !== id);
    } else {
      results = [...selections, id];
    }
    setSelections(results);
    onChange(results);
  };
  return (
    <div className="pm-photo-category-selector">
      <div>
        <PhotoCategoryIcon
          active={dropDownVisible}
          onClick={handleCategoryIconClick}
        />
      </div>
      <div
        className={cn(
          'pm-photo-category-dropdown',
          dropDownVisible && 'active'
        )}
      >
        <h3>Categories</h3>
        <ul className="pm-photo-category-list">
          {ALL_CATEGORIES.map((category) => {
            const isActive = selections.includes(category.id);
            return (
              <li key={category.id} className={cn(isActive && 'active')}>
                <input
                  id={`category_${category.id}`}
                  type="checkbox"
                  checked={isActive}
                  onChange={() => {
                    handleCategoryChange(category.id);
                  }}
                />
                <label htmlFor={`category_${category.id}`}>
                  {category.name}
                </label>
              </li>
            );
          })}
        </ul>
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
