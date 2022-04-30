import cn from 'classnames';
import { useEffect, useState } from 'react';

import { ALL_FEATURES } from '@/cached-data/all-features';

export interface FeatureSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function FeatureSelector({
  value: valueFromProp,
  onChange,
}: FeatureSelectorProps) {
  const [selection, setSelection] = useState<string>(valueFromProp);
  useEffect(() => {
    setSelection(valueFromProp);
  }, [valueFromProp]);
  const handleFeatureClick = (id: string) => {
    setSelection(id);
    onChange(id);
  };
  return (
    <ul className="pm-feature-selector">
      {ALL_FEATURES.map((feature) => {
        const isActive = selection === feature.id;
        return (
          <li
            key={feature.id}
            className={cn(isActive && 'active')}
            onClick={() => {
              handleFeatureClick(feature.id);
            }}
          >
            <label>{feature.name}</label>
          </li>
        );
      })}
    </ul>
  );
}
