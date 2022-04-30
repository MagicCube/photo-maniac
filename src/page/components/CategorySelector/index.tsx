import cn from 'classnames';
import { useEffect, useState } from 'react';

import { ALL_CATEGORIES } from '@/cached-data/all-categories';

export interface CategorySelectorProps {
  values: number[];
  onChange: (selections: number[]) => void;
}

export function CategorySelector({
  values: valueFromProp,
  onChange,
}: CategorySelectorProps) {
  const [selections, setSelections] = useState<number[]>(valueFromProp);
  useEffect(() => {
    setSelections(valueFromProp);
  }, [valueFromProp]);
  const handleChecked = (id: number) => {
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
    <ul className="pm-category-selector">
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
