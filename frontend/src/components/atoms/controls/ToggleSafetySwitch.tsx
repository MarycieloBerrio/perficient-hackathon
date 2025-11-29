import { useState } from 'react';
import { AlertStatus } from '../../../types';
import { clsx } from 'clsx';
import { AlertTriangle, Lock, Unlock } from 'lucide-react';

/**
 * Toggle safety switch component with optional safety cover
 * Provides critical operation protection with confirmation dialogs
 */

interface ToggleSafetySwitchProps {
    id: string;
    label: string;
    description: string;
    value: boolean;
    status: AlertStatus;
    locked: boolean;
    critical: boolean;
    requiresConfirmation: boolean;
    onChange: (value: boolean) => void;
}

const SAFETY_COVER_STYLES = {
    unlocked: 'bg-amber-950 text-amber-600 border border-amber-700',
    locked: 'bg-card text-gray-400 border border-gray-700'
} as const;

const TOGGLE_SWITCH_STYLES = {
    active: 'bg-primary shadow-md',
    inactive: 'bg-gray-700'
} as const;

export function ToggleSafetySwitch({
    id,
    label,
    description,
    value,
    status,
    locked,
    critical,
    requiresConfirmation,
    onChange
}: ToggleSafetySwitchProps) {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [safetyUnlocked, setSafetyUnlocked] = useState(!critical);

    const handleToggle = () => {
        if (locked || (critical && !safetyUnlocked)) return;

        if (requiresConfirmation && !value) {
            setShowConfirmation(true);
        } else {
            onChange(!value);
        }
    };

    const handleConfirm = () => {
        onChange(true);
        setShowConfirmation(false);
        if (critical) {
            setSafetyUnlocked(false);
        }
    };

    const handleCancel = () => {
        setShowConfirmation(false);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <label htmlFor={id} className="text-sm font-medium text-foreground flex items-center gap-2">
                        {critical && <AlertTriangle className="w-4 h-4 text-status-critical" />}
                        {label}
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                </div>
            </div>

            <div className={clsx(
                "relative p-4 rounded-md border transition-colors shadow-sm",
                critical ? 'border-status-critical/40 bg-status-critical/5' : 'border-gray-700 bg-card'
            )}>
                {critical && (
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-700">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Safety Cover
                        </span>
                        <button
                            onClick={() => setSafetyUnlocked(!safetyUnlocked)}
                            disabled={locked}
                            className={clsx(
                                "px-3 py-1 rounded text-xs font-medium uppercase tracking-wider transition-colors",
                                "flex items-center gap-1",
                                safetyUnlocked ? SAFETY_COVER_STYLES.unlocked : SAFETY_COVER_STYLES.locked,
                                !locked && 'hover:bg-opacity-80 cursor-pointer',
                                locked && 'opacity-50 cursor-not-allowed'
                            )}
                        >
                            {safetyUnlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                            {safetyUnlocked ? 'Unlocked' : 'Locked'}
                        </button>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                        Status: <span className={clsx(
                            "font-semibold uppercase",
                            value ? 'text-primary' : 'text-gray-400'
                        )}>
                            {value ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                    </span>
                    <button
                        onClick={handleToggle}
                        disabled={locked || (critical && !safetyUnlocked)}
                        className={clsx(
                            "relative w-16 h-8 rounded-full transition-all duration-300",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            value ? TOGGLE_SWITCH_STYLES.active : TOGGLE_SWITCH_STYLES.inactive,
                            !locked && (critical ? safetyUnlocked : true) && 'hover:opacity-90 cursor-pointer'
                        )}
                    >
                        <div className={clsx(
                            "absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-300",
                            "shadow-sm",
                            value ? 'left-9' : 'left-1'
                        )} />
                    </button>
                </div>
            </div>

            {showConfirmation && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-card border border-status-critical rounded-md p-6 max-w-md mx-4 shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="w-8 h-8 text-status-critical" />
                            <h3 className="text-xl font-semibold">Confirm Critical Action</h3>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Are you sure you want to activate <strong>{label}</strong>? This is a critical operation.
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
                                className="flex-1 px-4 py-2 bg-status-critical text-white rounded-md hover:bg-red-700 transition-colors font-semibold"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

