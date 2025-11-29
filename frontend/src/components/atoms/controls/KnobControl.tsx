import { useState, useRef } from 'react';
import { AlertStatus } from '../../../types';
import { clsx } from 'clsx';

/**
 * Rotary knob control for precise value adjustment
 * Supports drag interaction with mouse for intuitive control
 */

interface KnobControlProps {
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

const ROTATION_RANGE_DEGREES = 270;
const MIN_ROTATION_DEGREES = -135;
const MOUSE_SENSITIVITY_PX = 200;
const TICK_MARK_ANGLES = [0, 45, 90, 135, 180, 225, 270] as const;

const STATUS_BORDER_STYLES = {
    ok: 'border-primary shadow-md',
    warning: 'border-amber-600 shadow-md',
    critical: 'border-red-600 shadow-md',
    locked: 'border-gray-500 shadow-sm'
} as const;

const STATUS_TEXT_COLORS = {
    ok: 'text-primary',
    warning: 'text-amber-600',
    critical: 'text-red-600'
} as const;

export function KnobControl({
    id,
    label,
    value,
    min,
    max,
    unit = '',
    status,
    locked,
    onChange
}: KnobControlProps) {
    const [localValue, setLocalValue] = useState(value);
    const [isDragging, setIsDragging] = useState(false);
    const knobRef = useRef<HTMLDivElement>(null);
    const startY = useRef(0);
    const startValue = useRef(value);

    const percentage = ((localValue - min) / (max - min)) * 100;
    const rotation = (percentage / 100) * ROTATION_RANGE_DEGREES + MIN_ROTATION_DEGREES;

    const handleMouseDown = (e: React.MouseEvent) => {
        if (locked) return;
        setIsDragging(true);
        startY.current = e.clientY;
        startValue.current = localValue;
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || locked) return;
        
        const deltaY = startY.current - e.clientY;
        const range = max - min;
        const sensitivity = range / MOUSE_SENSITIVITY_PX;
        
        const newValue = Math.max(min, Math.min(max, startValue.current + deltaY * sensitivity));
        setLocalValue(newValue);
        onChange(newValue);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useState(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    });

    const borderStyle = locked ? STATUS_BORDER_STYLES.locked : STATUS_BORDER_STYLES[status];
    const textColor = STATUS_TEXT_COLORS[status];

    return (
        <div className="space-y-3 flex flex-col items-center">
            <label htmlFor={id} className="text-sm font-medium text-foreground">
                {label}
            </label>

            <div 
                ref={knobRef}
                onMouseDown={handleMouseDown}
                className={clsx(
                    "relative w-32 h-32 rounded-full transition-all duration-150",
                    "bg-gradient-to-br from-card to-muted border-2",
                    borderStyle,
                    !locked && 'cursor-pointer hover:scale-105',
                    locked && 'opacity-50 cursor-not-allowed',
                    isDragging && 'scale-105'
                )}
                style={{ 
                    transform: `rotate(${rotation}deg)`,
                    transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className={clsx(
                        "w-3 h-3 rounded-full shadow-sm",
                        locked ? 'bg-gray-500' : 'bg-primary'
                    )} />
                </div>

                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1 h-8 bg-background rounded-full" />

                {TICK_MARK_ANGLES.map((angle) => (
                    <div
                        key={angle}
                        className="absolute top-1/2 left-1/2 w-0.5 h-2 bg-border origin-bottom"
                        style={{
                            transform: `translate(-50%, -50%) rotate(${angle - 135}deg) translateY(-56px)`
                        }}
                    />
                ))}
            </div>

            <div className={clsx(
                "text-2xl font-mono font-semibold",
                textColor,
                locked && 'opacity-50'
            )}>
                {localValue.toFixed(0)}{unit}
            </div>

            <div className="flex justify-between w-full text-xs text-gray-400">
                <span>{min}{unit}</span>
                <span>{max}{unit}</span>
            </div>
        </div>
    );
}

