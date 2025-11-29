import { AlertStatus } from '../../../types';
import { clsx } from 'clsx';

/**
 * Radio button group component for mutually exclusive selections
 * Provides clear visual feedback for selected state
 */

interface RadioButtonGroupProps {
    id: string;
    label: string;
    value: string;
    options: string[];
    status: AlertStatus;
    locked: boolean;
    onChange: (value: string) => void;
}

const BORDER_COLORS = {
    ok: 'border-primary/40',
    warning: 'border-amber-600/40',
    critical: 'border-red-600/40'
} as const;

const ACTIVE_COLORS = {
    ok: 'bg-primary text-white shadow-md',
    warning: 'bg-amber-600 text-white shadow-md',
    critical: 'bg-red-600 text-white shadow-md'
} as const;

export function RadioButtonGroup({
    id,
    label,
    value,
    options,
    status,
    locked,
    onChange
}: RadioButtonGroupProps) {
    const borderColor = BORDER_COLORS[status];
    const activeColor = ACTIVE_COLORS[status];

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
                {label}
            </label>

            <div className="grid grid-cols-1 gap-2">
                {options.map((option) => {
                    const isSelected = value === option;
                    const formattedOption = option
                        .split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');

                    return (
                        <button
                            key={option}
                            onClick={() => !locked && onChange(option)}
                            disabled={locked}
                            className={clsx(
                                "relative px-4 py-3 rounded-md border transition-colors",
                                "text-sm font-medium text-left",
                                "disabled:cursor-not-allowed disabled:opacity-50",
                                isSelected 
                                    ? `${activeColor} border-transparent` 
                                    : `bg-card text-foreground ${borderColor} hover:bg-gray-800/40`,
                                !locked && 'cursor-pointer'
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={clsx(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                    isSelected 
                                        ? 'border-current' 
                                        : 'border-border'
                                )}>
                                    {isSelected && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-current" />
                                    )}
                                </div>

                                <span className="font-mono uppercase tracking-wider">
                                    {formattedOption}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

