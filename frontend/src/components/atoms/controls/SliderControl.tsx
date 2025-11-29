import { useState } from 'react';
import { AlertStatus } from '../../../types';
import { clsx } from 'clsx';

/**
 * Slider control component for horizontal value adjustment
 * Provides visual feedback based on status and displays current value
 */

interface SliderControlProps {
    id: string;
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    unit?: string;
    status: AlertStatus;
    locked: boolean;
    onChange: (value: number) => void;
}

const STATUS_GRADIENT_COLORS = {
    ok: 'from-primary to-blue-600',
    warning: 'from-amber-600 to-amber-700',
    critical: 'from-red-600 to-red-700',
    locked: 'from-gray-500 to-gray-600'
} as const;

const STATUS_TEXT_COLORS = {
    ok: 'text-primary',
    warning: 'text-amber-600',
    critical: 'text-red-600'
} as const;

export function SliderControl({
    id,
    label,
    value,
    min,
    max,
    step,
    unit = '',
    status,
    locked,
    onChange
}: SliderControlProps) {
    const [localValue, setLocalValue] = useState(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        setLocalValue(newValue);
        onChange(newValue);
    };

    const percentage = ((localValue - min) / (max - min)) * 100;
    const gradientColor = locked ? STATUS_GRADIENT_COLORS.locked : STATUS_GRADIENT_COLORS[status];
    const textColor = STATUS_TEXT_COLORS[status];

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label htmlFor={id} className="text-sm font-medium text-foreground">
                    {label}
                </label>
                <span className={clsx(
                    "text-lg font-mono font-semibold",
                    textColor,
                    locked && 'opacity-50'
                )}>
                    {localValue}{unit}
                </span>
            </div>
            
            <div className="relative">
                <div className="h-2 bg-card rounded-full border border-border" />
                
                <div 
                    className={clsx(
                        "absolute top-0 left-0 h-2 rounded-full transition-all duration-150",
                        "bg-gradient-to-r shadow-sm",
                        gradientColor
                    )}
                    style={{ width: `${percentage}%` }}
                />
                
                <input
                    id={id}
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={localValue}
                    onChange={handleChange}
                    disabled={locked}
                    className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                
                <div 
                    className={clsx(
                        "absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition-all duration-150",
                        "border-2 bg-background shadow-md pointer-events-none",
                        locked ? 'border-gray-500' : 'border-primary'
                    )}
                    style={{ left: `calc(${percentage}% - 8px)` }}
                />
            </div>
            
            <div className="flex justify-between text-xs text-gray-400">
                <span>{min}{unit}</span>
                <span>{max}{unit}</span>
            </div>
        </div>
    );
}

