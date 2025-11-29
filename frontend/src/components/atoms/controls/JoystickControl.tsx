import { useState, useRef, useEffect } from 'react';
import { AlertStatus } from '../../../types';
import { clsx } from 'clsx';
import { Navigation } from 'lucide-react';

interface JoystickControlProps {
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

export function JoystickControl({
    id,
    label,
    value,
    min,
    max,
    unit,
    status,
    locked,
    onChange
}: JoystickControlProps) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (locked) return;
        setIsDragging(true);
        updatePosition(e.clientX, e.clientY);
    };

    const updatePosition = (clientX: number, clientY: number) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        let x = clientX - centerX;
        let y = clientY - centerY;

        // Limit to circle
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = rect.width / 2 - 20;
        
        if (distance > maxDistance) {
            const angle = Math.atan2(y, x);
            x = Math.cos(angle) * maxDistance;
            y = Math.sin(angle) * maxDistance;
        }

        setPosition({ x, y });

        // Calculate angle for value
        const angle = Math.atan2(-y, x) * (180 / Math.PI);
        const normalizedAngle = (angle + 360) % 360;
        const newValue = min + (normalizedAngle / 360) * (max - min);
        onChange(newValue);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || locked) return;
        updatePosition(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        // Return to center
        setPosition({ x: 0, y: 0 });
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging]);

    const getStatusColor = () => {
        if (locked) return 'border-gray-500';
        switch (status) {
            case 'ok': return 'border-neon-cyan shadow-glow-cyan';
            case 'warning': return 'border-neon-amber shadow-glow-amber';
            case 'critical': return 'border-status-critical shadow-glow-red';
        }
    };

    const getStickColor = () => {
        if (locked) return 'bg-gray-500';
        switch (status) {
            case 'ok': return 'bg-neon-cyan shadow-glow-cyan';
            case 'warning': return 'bg-neon-amber shadow-glow-amber';
            case 'critical': return 'bg-status-critical shadow-glow-red';
        }
    };

    return (
        <div className="space-y-4 flex flex-col items-center">
            <label htmlFor={id} className="text-sm font-medium text-foreground">
                {label}
            </label>

            {/* Joystick container */}
            <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                className={clsx(
                    "relative w-40 h-40 rounded-full transition-all",
                    "bg-gradient-to-br from-card to-muted border-4",
                    "flex items-center justify-center",
                    getStatusColor(),
                    !locked && 'cursor-pointer',
                    locked && 'opacity-50 cursor-not-allowed'
                )}
            >
                {/* Crosshair */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-border opacity-30" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-full w-0.5 bg-border opacity-30" />
                </div>

                {/* Circle guides */}
                <div className="absolute inset-4 rounded-full border border-border opacity-20" />
                <div className="absolute inset-8 rounded-full border border-border opacity-20" />
                <div className="absolute inset-12 rounded-full border border-border opacity-20" />

                {/* Stick */}
                <div
                    className={clsx(
                        "absolute w-8 h-8 rounded-full transition-all",
                        "border-2 border-background",
                        getStickColor(),
                        isDragging && 'scale-110'
                    )}
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px)`,
                        transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                    }}
                >
                    <Navigation className="w-full h-full p-1.5 text-background" />
                </div>

                {/* Center dot */}
                <div className="w-2 h-2 rounded-full bg-border" />
            </div>

            {/* Value display */}
            <div className={clsx(
                "text-2xl font-mono font-bold",
                status === 'ok' && 'text-neon-cyan',
                status === 'warning' && 'text-neon-amber',
                status === 'critical' && 'text-status-critical',
                locked && 'opacity-50'
            )}>
                {value.toFixed(0)}{unit}
            </div>

            {/* Coordinates display */}
            <div className="flex gap-4 text-xs text-muted-foreground font-mono">
                <span>X: {position.x.toFixed(0)}</span>
                <span>Y: {position.y.toFixed(0)}</span>
            </div>

            {/* Range */}
            <div className="text-xs text-muted-foreground">
                Range: {min}{unit} to {max}{unit}
            </div>
        </div>
    );
}

