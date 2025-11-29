import { Dome } from '../types';
import { clsx } from 'clsx';

/**
 * Map panel component displaying all domes on Mars surface
 * Shows dome locations, statuses, and provides interactive selection
 */

interface MapPanelProps {
    domes: Dome[];
    selectedDomeId: string | null;
    onDomeSelect: (dome: Dome) => void;
    marsImageUrl: string;
    fullscreen?: boolean;
}

const STATUS_COLORS = {
    ok: { 
        border: 'border-status-ok', 
        bg: 'bg-status-ok/20', 
        text: 'text-status-ok'
    },
    warning: { 
        border: 'border-status-warning', 
        bg: 'bg-status-warning/20', 
        text: 'text-status-warning'
    },
    critical: { 
        border: 'border-status-critical', 
        bg: 'bg-status-critical/20', 
        text: 'text-status-critical'
    }
} as const;

const STATUS_INFO = {
    ok: { 
        label: 'Operational', 
        color: 'text-status-ok', 
        bg: 'bg-status-ok/20', 
        border: 'border-status-ok' 
    },
    warning: { 
        label: 'Warning', 
        color: 'text-status-warning', 
        bg: 'bg-status-warning/20', 
        border: 'border-status-warning' 
    },
    critical: { 
        label: 'Critical', 
        color: 'text-status-critical', 
        bg: 'bg-status-critical/20', 
        border: 'border-status-critical' 
    }
} as const;

const BACKGROUND_OPACITY = 0.6;
const GRID_PATTERN_SIZE = '100px';

export function MapPanel({ domes, selectedDomeId, onDomeSelect, marsImageUrl, fullscreen = false }: MapPanelProps) {
    return (
        <div className="relative w-full h-full bg-mars-bg overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{ 
                    backgroundImage: `url(${marsImageUrl})`,
                    opacity: BACKGROUND_OPACITY
                }}
            />

            <div className="absolute inset-0 bg-gradient-to-b from-mars-bg/50 via-transparent to-mars-bg/80" />

            <div className="absolute inset-0 bg-[linear-gradient(rgba(99,110,123,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(99,110,123,0.06)_1px,transparent_1px)] bg-[size:100px_100px]" />

            {domes.map(dome => {
                const colors = STATUS_COLORS[dome.status];

                return (
                    <button
                        key={dome.id}
                        onClick={() => onDomeSelect(dome)}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group/marker z-20"
                        style={{ left: `${dome.position.x}%`, top: `${dome.position.y}%` }}
                    >
                        {dome.status === 'critical' && (
                            <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-status-critical" />
                        )}

                        <div className={clsx(
                            "absolute inset-0 rounded-full border-2 opacity-20 scale-150",
                            colors.border
                        )} />

                        <div className={clsx(
                            "relative w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center backdrop-blur-lg transition-all",
                            "hover:scale-110 cursor-pointer shadow-md",
                            selectedDomeId === dome.id && "scale-110",
                            colors.border,
                            colors.bg,
                            colors.text
                        )}>
                            <span className="font-semibold text-lg">{dome.name.split(' ')[1]}</span>
                            <span className="text-[8px] uppercase tracking-wider opacity-60">
                                {dome.population}
                            </span>
                        </div>

                        <div className={clsx(
                            "absolute top-full mt-3 left-1/2 -translate-x-1/2 transition-all",
                            "bg-mars-elevated/95 backdrop-blur-md border border-gray-700 px-3 py-1.5 rounded-md shadow-lg",
                            "text-sm text-foreground whitespace-nowrap pointer-events-none",
                            fullscreen 
                                ? 'opacity-100' 
                                : 'opacity-0 group-hover/marker:opacity-100'
                        )}>
                            <div className="font-semibold">{dome.name}</div>
                            <div className="text-xs text-gray-400 flex items-center gap-2">
                                <span>{dome.systems.filter(s => s.status === 'ok').length}/{dome.systems.length} OK</span>
                            </div>
                        </div>

                        {fullscreen && dome.id === 'dome-alpha' && (
                            <svg className="absolute top-1/2 left-1/2 pointer-events-none" style={{ width: '25vw', height: '10vh' }}>
                                <line 
                                    x1="0" 
                                    y1="0" 
                                    x2="100%" 
                                    y2="100%" 
                                    stroke="rgba(99,110,123,0.3)" 
                                    strokeWidth="1.5" 
                                    strokeDasharray="5,5"
                                />
                            </svg>
                        )}
                    </button>
                );
            })}

            {fullscreen && (
                <div className="absolute top-6 right-6 flex flex-col gap-3 z-10">
                    {(['ok', 'warning', 'critical'] as const).map((status) => {
                        const count = domes.filter(d => d.status === status).length;
                        const info = STATUS_INFO[status];

                        return (
                            <div 
                                key={status}
                                className={clsx(
                                    "px-5 py-3 rounded-md border backdrop-blur-lg transition-colors shadow-sm",
                                    "min-w-[140px]",
                                    info.bg,
                                    info.border
                                )}
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                                        {info.label}
                                    </div>
                                    <div className={clsx("text-2xl font-semibold font-mono", info.color)}>
                                        {count}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
