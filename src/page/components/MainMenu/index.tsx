import cn from 'classnames';
import { useEffect, useState } from 'react';

import { CategorySelector } from '../CategorySelector';
import { FeatureSelector } from '../FeatureSelector';

import { MainMenuIcon } from './MainMenuIcon';

export interface MainMenuProps {
  feature: string;
  categories: number[];
  onFeatureChange: (feature: string) => void;
  onCategoriesChange: (categories: number[]) => void;
  onUpdateClick: () => void;
}

export function MainMenu({
  feature: featureFromProp,
  categories: categoriesFromProp,
  onFeatureChange,
  onCategoriesChange,
  onUpdateClick: onUpdate,
}: MainMenuProps) {
  const [active, setActive] = useState(false);
  const [feature, setFeature] = useState(featureFromProp);
  const [categories, setCategories] = useState<number[]>(categoriesFromProp);
  useEffect(() => {
    setFeature(featureFromProp);
  }, [featureFromProp]);
  useEffect(() => {
    setCategories(categoriesFromProp);
  }, [categoriesFromProp]);
  const handleIconClick = () => {
    setActive(!active);
  };
  const handleFeatureChanged = (value: string) => {
    setFeature(value);
    onFeatureChange(value);
  };
  const handleCategoryChanged = (values: number[]) => {
    setCategories(values);
    onCategoriesChange(values);
  };
  return (
    <div className="pm-main-menu">
      <div>
        <MainMenuIcon active={active} onClick={handleIconClick} />
      </div>
      <div className={cn('pm-main-menu-dropdown', active && 'active')}>
        <section>
          <h3>Features</h3>
          <FeatureSelector value={feature} onChange={handleFeatureChanged} />
        </section>
        <section>
          <h3>Categories</h3>
          <CategorySelector
            values={categories}
            onChange={handleCategoryChanged}
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
