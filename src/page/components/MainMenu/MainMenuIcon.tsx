import cn from 'classnames';

export interface MainMenuIconProps {
  active?: boolean;
  onClick: () => void;
}

export function MainMenuIcon({ active, onClick }: MainMenuIconProps) {
  return (
    <div className={cn('pm-menu-icon', active && 'active')} onClick={onClick}>
      <div />
      <div />
      <div />
    </div>
  );
}
