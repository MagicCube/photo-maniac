import cn from 'classnames';

export interface IconProps {
  active?: boolean;
  onClick: () => void;
}

export function MainMenuIcon({ active, onClick }: IconProps) {
  return (
    <div className={cn('pm-icon-menu', active && 'active')} onClick={onClick}>
      <div />
      <div />
      <div />
    </div>
  );
}

export function GalleryMenuIcon({ active, onClick }: IconProps) {
  return (
    <div
      className={cn('pm-icon-gallery', active && 'active')}
      onClick={onClick}
    >
      <div />
      <div />
      <div />
      <div />
    </div>
  );
}
