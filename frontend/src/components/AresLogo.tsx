import { clsx } from 'clsx';

interface AresLogoProps {
  size?: 'small' | 'medium' | 'large';
  showSubtitle?: boolean;
  className?: string;
}

export function AresLogo({ size = 'medium', showSubtitle = true, className }: AresLogoProps) {
  const sizes = {
    small: {
      container: 'w-8 h-8',
      text: 'text-base',
      title: 'text-sm',
      subtitle: 'text-[9px]',
    },
    medium: {
      container: 'w-10 h-10',
      text: 'text-xl',
      title: 'text-xl',
      subtitle: 'text-[10px]',
    },
    large: {
      container: 'w-16 h-16',
      text: 'text-3xl',
      title: 'text-5xl',
      subtitle: 'text-sm',
    },
  };

  const sizeConfig = sizes[size];

  return (
    <div className={clsx('flex items-center gap-3', className)}>
      <div 
        className={clsx(
          sizeConfig.container,
          'rounded-md bg-gradient-to-br from-primary via-primary to-orange-600',
          'flex items-center justify-center text-white font-bold shadow-lg',
          'border border-primary/50 relative overflow-hidden'
        )}
      >
        {/* Efecto de brillo */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
        <span className={clsx(sizeConfig.text, 'relative z-10')}>A</span>
      </div>
      <div>
        <h1 className={clsx(sizeConfig.title, 'font-bold leading-none text-foreground tracking-wide')}>
          ARES
        </h1>
        {showSubtitle && (
          <span className={clsx(sizeConfig.subtitle, 'text-gray-400 font-medium tracking-tight block')}>
            Analytics of Resources and Environmental State
          </span>
        )}
      </div>
    </div>
  );
}

