import { MatrixButton, AlertStatus } from '../../../types';
import { clsx } from 'clsx';

interface ButtonMatrixProps {
    id: string;
    label: string;
    matrix: MatrixButton[][];
    status: AlertStatus;
    locked: boolean;
    onChange: (buttonId: string, enabled: boolean) => void;
}

export function ButtonMatrix({
    id,
    label,
    matrix,
    status,
    locked,
    onChange
}: ButtonMatrixProps) {
    const getButtonStatusColor = (buttonStatus: AlertStatus, enabled: boolean) => {
        if (!enabled) return 'bg-muted text-muted-foreground border-border';
        
        switch (buttonStatus) {
            case 'ok': return 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan shadow-glow-cyan';
            case 'warning': return 'bg-neon-amber/20 text-neon-amber border-neon-amber shadow-glow-amber';
            case 'critical': return 'bg-status-critical/20 text-status-critical border-status-critical shadow-glow-red';
        }
    };

    return (
        <div className="space-y-3">
            <label htmlFor={id} className="text-sm font-medium text-foreground">
                {label}
            </label>

            <div className="space-y-2">
                {matrix.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-3 gap-2">
                        {row.map((button) => (
                            <button
                                key={button.id}
                                onClick={() => !locked && onChange(button.id, !button.enabled)}
                                disabled={locked}
                                className={clsx(
                                    "relative h-16 rounded-lg border-2 transition-all",
                                    "flex flex-col items-center justify-center",
                                    "font-mono font-bold text-sm",
                                    "disabled:cursor-not-allowed disabled:opacity-50",
                                    !locked && 'hover:scale-105 cursor-pointer',
                                    getButtonStatusColor(button.status, button.enabled)
                                )}
                            >
                                {/* Label */}
                                <span className="text-lg">{button.label}</span>
                                
                                {/* Status indicator */}
                                <div className="absolute top-1 right-1">
                                    <div className={clsx(
                                        "w-2 h-2 rounded-full",
                                        button.enabled && button.status === 'ok' && 'bg-neon-cyan',
                                        button.enabled && button.status === 'warning' && 'bg-neon-amber animate-pulse',
                                        button.enabled && button.status === 'critical' && 'bg-status-critical animate-pulse',
                                        !button.enabled && 'bg-muted-foreground'
                                    )} />
                                </div>

                                {/* Enabled/Disabled indicator */}
                                <span className="text-[10px] uppercase tracking-wider opacity-70 mt-1">
                                    {button.enabled ? 'ONLINE' : 'OFFLINE'}
                                </span>
                            </button>
                        ))}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-neon-cyan" />
                    <span>OK</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-neon-amber" />
                    <span>Warning</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-status-critical" />
                    <span>Critical</span>
                </div>
            </div>
        </div>
    );
}

