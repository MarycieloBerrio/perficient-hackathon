import { useState } from 'react';
import { AlertStatus } from '../../../types';
import { clsx } from 'clsx';
import { Thermometer } from 'lucide-react';

/**
 * Vertical slider control component
 * Provides visual feedback with gradient colors based on value range and status
 */

interface VerticalSliderProps {
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

const VALUE_RANGE_GRADIENTS = {
    low: 'from-blue-600 to-primary',
    medium: 'from-primary to-status-ok',
    high: 'from-amber-600 to-status-critical'
} as const;

const STATUS_TEXT_COLORS = {
    ok: 'text-primary',
    warning: 'text-amber-600',
    critical: 'text-red-600'
} as const;

const TICK_MARKS = [0, 25, 50, 75, 100] as const;

export function VerticalSlider({
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
}: VerticalSliderProps) {
    const [localValue, setLocalValue] = useState(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        setLocalValue(newValue);
        onChange(newValue);
    };

    const percentage = ((localValue - min) / (max - min)) * 100;
    const normalizedValue = (localValue - min) / (max - min);
    
    const getGradientColor = () => {
        if (normalizedValue < 0.3) return VALUE_RANGE_GRADIENTS.low;
        if (normalizedValue > 0.7) return VALUE_RANGE_GRADIENTS.high;
        return VALUE_RANGE_GRADIENTS.medium;
    };

    const textColor = STATUS_TEXT_COLORS[status];

    return (
        <div className="flex flex-col items-center space-y-4">
            <label htmlFor={id} className="text-sm font-medium text-foreground flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                {label}
            </label>

            <div className="flex items-center gap-6">
                <span className="text-xs text-muted-foreground font-mono">
                    {max}{unit}
                </span>

                <div className="relative h-64 w-12 flex items-center justify-center">
                    <div className="absolute w-3 h-full bg-card rounded-full border border-border" />

                    <div 
                        className={clsx(
                            "absolute w-3 rounded-full bottom-0 transition-all duration-150",
                            "bg-gradient-to-t shadow-md",
                            getGradientColor()
                        )}
                        style={{ height: `${percentage}%` }}
                    />

                    {TICK_MARKS.map((tick) => (
                        <div 
                            key={tick}
                            className="absolute left-0 w-full flex items-center"
                            style={{ bottom: `${tick}%` }}
                        >
                            <div className="w-2 h-0.5 bg-border" />
                        </div>
                    ))}

                    <input
                        id={id}
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={localValue}
                        onChange={handleChange}
                        disabled={locked}
                        orient="vertical"
                        className="absolute h-full w-3 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        style={{ 
                            writingMode: 'bt-lr',
                            WebkitAppearance: 'slider-vertical'
                        }}
                    />

                    <div 
                        className={clsx(
                            "absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full transition-all duration-150",
                            "border-2 bg-background shadow-md pointer-events-none z-10",
                            locked ? 'border-gray-500' : 'border-primary'
                        )}
                        style={{ bottom: `calc(${percentage}% - 10px)` }}
                    />
                </div>

                <span className="text-xs text-muted-foreground font-mono">
                    {min}{unit}
                </span>
            </div>

            <div className={clsx(
                "text-3xl font-mono font-semibold",
                textColor,
                locked && 'opacity-50'
            )}>
                {localValue.toFixed(1)}{unit}
            </div>
        </div>
    );
}

