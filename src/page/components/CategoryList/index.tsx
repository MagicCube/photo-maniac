import cn from 'classnames';
import { useEffect, useState } from 'react';

import { ALL_CATEGORIES } from '@/cached-data/all-categories';

export interface CategoryListProps {
  selections: number[];
  onSelectionsChanged: (selections: number[]) => void;
}

export function CategoryList({
  selections: selectionsFromProp,
  onSelectionsChanged,
}: CategoryListProps) {
  const [selections, setSelections] = useState<number[]>(selectionsFromProp);
  useEffect(() => {
    setSelections(selectionsFromProp);
  }, [selectionsFromProp]);
  const handleChecked = (id: number) => {
    let results: number[];
    if (selections.includes(id)) {
      results = selections.filter((selection) => selection !== id);
    } else {
      results = [...selections, id];
    }
    setSelections(results);
    onSelectionsChanged(results);
  };
  return (
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
                handleChecked(category.id);
              }}
            />
            <label htmlFor={`category_${category.id}`}>{category.name}</label>
          </li>
        );
      })}
    </ul>
  );
}
