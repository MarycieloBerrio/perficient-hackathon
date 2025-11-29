import { useState } from 'react';
import { AlertStatus } from '../../../types';
import { clsx } from 'clsx';
import { Plus, Minus } from 'lucide-react';

interface StepperInputProps {
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

export function StepperInput({
    id,
    label,
    value,
    min,
    max,
    step,
    unit,
    status,
    locked,
    onChange
}: StepperInputProps) {
    const [localValue, setLocalValue] = useState(value);

    const handleIncrement = () => {
        if (locked) return;
        const newValue = Math.min(max, localValue + step);
        setLocalValue(newValue);
        onChange(newValue);
    };

    const handleDecrement = () => {
        if (locked) return;
        const newValue = Math.max(min, localValue - step);
        setLocalValue(newValue);
        onChange(newValue);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        if (!isNaN(newValue) && newValue >= min && newValue <= max) {
            setLocalValue(newValue);
            onChange(newValue);
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'ok': return 'border-neon-cyan text-neon-cyan';
            case 'warning': return 'border-neon-amber text-neon-amber';
            case 'critical': return 'border-status-critical text-status-critical';
        }
    };

    return (
        <div className="space-y-3">
            <label htmlFor={id} className="text-sm font-medium text-foreground">
                {label}
            </label>

            <div className="flex items-center gap-2">
                {/* Decrement button */}
                <button
                    onClick={handleDecrement}
                    disabled={locked || localValue <= min}
                    className={clsx(
                        "w-10 h-10 rounded-lg border-2 transition-all",
                        "flex items-center justify-center",
                        "disabled:opacity-30 disabled:cursor-not-allowed",
                        !locked && localValue > min && 'hover:scale-110 hover:shadow-glow-cyan cursor-pointer',
                        getStatusColor()
                    )}
                >
                    <Minus className="w-5 h-5" />
                </button>

                {/* Value display/input */}
                <div className={clsx(
                    "flex-1 h-10 rounded-lg border-2 transition-all",
                    "flex items-center justify-center",
                    "bg-card",
                    getStatusColor()
                )}>
                    <input
                        id={id}
                        type="number"
                        value={localValue.toFixed(step < 1 ? 1 : 0)}
                        onChange={handleInputChange}
                        disabled={locked}
                        step={step}
                        min={min}
                        max={max}
                        className={clsx(
                            "w-full h-full bg-transparent text-center",
                            "font-mono text-lg font-bold",
                            "outline-none border-none",
                            "disabled:cursor-not-allowed"
                        )}
                    />
                    {unit && (
                        <span className="text-sm text-muted-foreground mr-3">{unit}</span>
                    )}
                </div>

                {/* Increment button */}
                <button
                    onClick={handleIncrement}
                    disabled={locked || localValue >= max}
                    className={clsx(
                        "w-10 h-10 rounded-lg border-2 transition-all",
                        "flex items-center justify-center",
                        "disabled:opacity-30 disabled:cursor-not-allowed",
                        !locked && localValue < max && 'hover:scale-110 hover:shadow-glow-cyan cursor-pointer',
                        getStatusColor()
                    )}
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {/* Range indicator */}
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>Min: {min}{unit}</span>
                <span>Max: {max}{unit}</span>
            </div>
        </div>
    );
}

