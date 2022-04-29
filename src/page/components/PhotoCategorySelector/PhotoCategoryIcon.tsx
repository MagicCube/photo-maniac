import cn from 'classnames';

export interface PhotoCategoryIconProps {
  active?: boolean;
  onClick: () => void;
}

export function PhotoCategoryIcon({ active, onClick }: PhotoCategoryIconProps) {
  return (
    <div
      className={cn('pm-photo-category-icon', active && 'active')}
      onClick={onClick}
    >
      <div />
      <div />
      <div />
    </div>
  );
}
