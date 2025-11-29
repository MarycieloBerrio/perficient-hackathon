import { useState, useEffect } from 'react';
import { AlertStatus } from '../../../types';
import { clsx } from 'clsx';

/**
 * Push button component for triggering critical actions
 * Provides visual feedback with ripple effects and optional confirmation
 */

interface PushButtonProps {
    id: string;
    label: string;
    description: string;
    status: AlertStatus;
    locked: boolean;
    critical: boolean;
    requiresConfirmation: boolean;
    onPress: () => void;
}

const BUTTON_STYLES = {
    locked: 'border-gray-500 bg-gray-500/10 text-gray-500',
    critical: 'border-status-critical/40 bg-status-critical/10 text-status-critical',
    ok: 'border-primary bg-primary/10 text-primary',
    warning: 'border-amber-600 bg-amber-600/10 text-amber-600',
    error: 'border-red-600 bg-red-600/10 text-red-600'
} as const;

const PRESS_FEEDBACK_DURATION_MS = 200;
const RIPPLE_CLEANUP_DURATION_MS = 600;

export function PushButton({
    id,
    label,
    description,
    status,
    locked,
    critical,
    requiresConfirmation,
    onPress
}: PushButtonProps) {
    const [isPressed, setIsPressed] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

    const handlePress = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (locked) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newRipple = { id: Date.now(), x, y };
        setRipples([...ripples, newRipple]);

        setIsPressed(true);
        setTimeout(() => setIsPressed(false), PRESS_FEEDBACK_DURATION_MS);

        if (requiresConfirmation) {
            setShowConfirmation(true);
        } else {
            onPress();
        }
    };

    const handleConfirm = () => {
        onPress();
        setShowConfirmation(false);
    };

    const handleCancel = () => {
        setShowConfirmation(false);
    };

    useEffect(() => {
        if (ripples.length > 0) {
            const timer = setTimeout(() => {
                setRipples(ripples.slice(1));
            }, RIPPLE_CLEANUP_DURATION_MS);
            return () => clearTimeout(timer);
        }
    }, [ripples]);

    const getButtonColor = () => {
        if (locked) return BUTTON_STYLES.locked;
        if (critical) return BUTTON_STYLES.critical;
        
        switch (status) {
            case 'ok': return BUTTON_STYLES.ok;
            case 'warning': return BUTTON_STYLES.warning;
            case 'critical': return BUTTON_STYLES.error;
        }
    };

    return (
        <>
            <button
                id={id}
                onClick={handlePress}
                disabled={locked}
                className={clsx(
                    "relative w-full px-6 py-8 rounded-md border-2 transition-all overflow-hidden",
                    "flex flex-col items-center justify-center gap-2",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "shadow-md",
                    getButtonColor(),
                    !locked && 'hover:scale-[1.01] active:scale-98 cursor-pointer',
                    isPressed && 'scale-98'
                )}
            >
                {ripples.map((ripple) => (
                    <span
                        key={ripple.id}
                        className="absolute w-2 h-2 rounded-full bg-current opacity-50 animate-ping"
                        style={{
                            left: ripple.x,
                            top: ripple.y,
                            animationDuration: '600ms'
                        }}
                    />
                ))}

                <span className="text-2xl font-semibold uppercase tracking-wider relative z-10">
                    {label}
                </span>
                <span className="text-xs text-gray-400 relative z-10">
                    {description}
                </span>

                {!locked && (
                    <div className="absolute inset-0 bg-gradient-radial from-current/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                )}
            </button>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className={clsx(
                        "bg-card rounded-md p-6 max-w-md mx-4 border shadow-xl",
                        critical ? 'border-status-critical' : 'border-primary'
                    )}>
                        <h3 className="text-xl font-semibold mb-2">Confirm Action</h3>
                        <p className="text-sm text-gray-400 mb-2">
                            {description}
                        </p>
                        <p className="text-foreground mb-6">
                            Are you sure you want to execute: <strong>{label}</strong>?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancel}
                                className="flex-1 px-4 py-2 bg-gray-700 text-foreground rounded-md hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className={clsx(
                                    "flex-1 px-4 py-2 rounded-md transition-colors font-semibold",
                                    critical 
                                        ? 'bg-status-critical text-white hover:bg-red-700'
                                        : 'bg-primary text-white hover:bg-blue-700'
                                )}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

