import { useState } from 'react';
import { AlertStatus } from '../../../types';
import { clsx } from 'clsx';
import { Pause, Play, X } from 'lucide-react';

interface ProgressBarControlProps {
    id: string;
    label: string;
    value: number;
    min: number;
    max: number;
    unit?: string;
    status: AlertStatus;
    locked: boolean;
    onChange: (value: number) => void;
}

export function ProgressBarControl({
    id,
    label,
    value,
    min,
    max,
    unit,
    status,
    locked,
    onChange
}: ProgressBarControlProps) {
    const [isPaused, setIsPaused] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    const percentage = ((localValue - min) / (max - min)) * 100;

    const handlePause = () => {
        if (locked) return;
        setIsPaused(!isPaused);
    };

    const handleAbort = () => {
        if (locked) return;
        setLocalValue(min);
        onChange(min);
        setIsPaused(false);
    };

    const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        setLocalValue(newValue);
        onChange(newValue);
    };

    const getBarColor = () => {
        if (isPaused) return 'from-neon-amber to-status-warning';
        
        switch (status) {
            case 'ok': return 'from-neon-cyan to-neon-blue';
            case 'warning': return 'from-neon-amber to-status-warning';
            case 'critical': return 'from-status-critical to-destructive';
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <label htmlFor={id} className="text-sm font-medium text-foreground">
                    {label}
                </label>
                <span className={clsx(
                    "text-lg font-mono font-bold",
                    status === 'ok' && 'text-neon-cyan',
                    status === 'warning' && 'text-neon-amber',
                    status === 'critical' && 'text-status-critical',
                    isPaused && 'text-neon-amber animate-pulse'
                )}>
                    {localValue.toFixed(0)}{unit}
                </span>
            </div>

            {/* Progress bar */}
            <div className="relative h-8 bg-card rounded-lg border border-border overflow-hidden">
                {/* Fill */}
                <div 
                    className={clsx(
                        "absolute inset-y-0 left-0 transition-all duration-300",
                        "bg-gradient-to-r",
                        getBarColor()
                    )}
                    style={{ width: `${percentage}%` }}
                >
                    {/* Animated stripes when active */}
                    {!isPaused && (
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%,rgba(255,255,255,0.1))] bg-[length:20px_20px] animate-[slide_1s_linear_infinite]" />
                    )}
                </div>

                {/* Percentage text overlay */}
                <div className="relative h-full flex items-center justify-center">
                    <span className="text-xs font-mono font-bold text-foreground mix-blend-difference">
                        {percentage.toFixed(1)}%
                    </span>
                </div>
            </div>

            {/* Manual slider control */}
            <input
                id={id}
                type="range"
                min={min}
                max={max}
                step={1}
                value={localValue}
                onChange={handleManualChange}
                disabled={locked || !isPaused}
                className="w-full h-1 opacity-50 cursor-pointer disabled:cursor-not-allowed"
            />

            {/* Control buttons */}
            <div className="flex gap-2">
                <button
                    onClick={handlePause}
                    disabled={locked}
                    className={clsx(
                        "flex-1 px-4 py-2 rounded-lg border-2 transition-all",
                        "flex items-center justify-center gap-2",
                        "font-medium text-sm uppercase tracking-wider",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        isPaused 
                            ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/10 hover:bg-neon-cyan/20' 
                            : 'border-neon-amber text-neon-amber bg-neon-amber/10 hover:bg-neon-amber/20',
                        !locked && 'hover:scale-[1.02] cursor-pointer'
                    )}
                >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    {isPaused ? 'Resume' : 'Pause'}
                </button>

                <button
                    onClick={handleAbort}
                    disabled={locked}
                    className={clsx(
                        "px-4 py-2 rounded-lg border-2 transition-all",
                        "flex items-center justify-center gap-2",
                        "font-medium text-sm uppercase tracking-wider",
                        "border-status-critical text-status-critical bg-status-critical/10",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        !locked && 'hover:bg-status-critical/20 hover:scale-[1.02] cursor-pointer'
                    )}
                >
                    <X className="w-4 h-4" />
                    Abort
                </button>
            </div>

            {/* Status indicator */}
            {isPaused && (
                <div className="flex items-center gap-2 text-xs text-neon-amber animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-neon-amber" />
                    <span>PAUSED - Manual control enabled</span>
                </div>
            )}
        </div>
    );
}

