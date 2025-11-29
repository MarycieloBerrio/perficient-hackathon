import { DomeCategory, AlertStatus } from '../types';
import { clsx } from 'clsx';
import * as Icons from 'lucide-react';

interface DomeCategoryPanelProps {
    categories: DomeCategory[];
    selectedCategoryId: string | null;
    onCategorySelect: (category: DomeCategory) => void;
}

export function DomeCategoryPanel({
    categories,
    selectedCategoryId,
    onCategorySelect
}: DomeCategoryPanelProps) {
    const getIcon = (iconName: string) => {
        const Icon = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
        return Icon ? <Icon className="w-5 h-5" /> : <Icons.Box className="w-5 h-5" />;
    };

    const getStatusColor = (status: AlertStatus) => {
        switch (status) {
            case 'ok': return 'text-status-ok border-status-ok/30 bg-status-ok/10';
            case 'warning': return 'text-status-warning border-status-warning/30 bg-status-warning/10';
            case 'critical': return 'text-status-critical border-status-critical/30 bg-status-critical/10';
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'immediate': return 'bg-red-950 text-red-400 border border-red-800';
            case 'high': return 'bg-amber-950 text-amber-400 border border-amber-800';
            case 'medium': return 'bg-blue-950 text-blue-400 border border-blue-800';
            case 'low': return 'bg-gray-800 text-gray-400 border border-gray-700';
            default: return 'bg-gray-800 text-gray-400 border border-gray-700';
        }
    };

    return (
        <div className="h-full bg-mars-surface border-r border-mars-border flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-mars-border bg-mars-elevated">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Control Systems
                </h2>
            </div>

            {/* Categories list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {categories.map((category) => {
                    const isSelected = selectedCategoryId === category.id;
                    const criticalSystems = category.systems.filter(s => s.status === 'critical').length;
                    const warningSystems = category.systems.filter(s => s.status === 'warning').length;

                    return (
                        <button
                            key={category.id}
                            onClick={() => onCategorySelect(category)}
                            className={clsx(
                                "w-full p-4 rounded-md border transition-colors text-left shadow-sm",
                                "hover:bg-gray-800/40 cursor-pointer",
                                isSelected
                                    ? 'bg-primary/10 border-primary/50'
                                    : 'bg-mars-elevated border-gray-700 hover:border-gray-600',
                                category.status === 'critical' && !isSelected && 'border-status-critical/40'
                            )}
                        >
                            {/* Top row: Icon, Title, Priority */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className={clsx(
                                        "p-2 rounded-md border",
                                        isSelected ? 'border-primary/50 text-primary bg-primary/10' : getStatusColor(category.status)
                                    )}>
                                        {getIcon(category.icon)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={clsx(
                                            "text-sm font-semibold",
                                            isSelected ? 'text-primary' : 'text-foreground'
                                        )}>
                                            {category.name}
                                        </h3>
                                    </div>
                                </div>

                                {/* Priority badge */}
                                <span className={clsx(
                                    "px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider",
                                    getPriorityBadge(category.priority)
                                )}>
                                    {category.priority}
                                </span>
                            </div>

                            {/* System count and status indicators */}
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2 text-xs">
                                    <span className="text-gray-400">
                                        {category.systems.length} systems
                                    </span>
                                </div>

                                <div className="flex gap-1.5">
                                    {criticalSystems > 0 && (
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-status-critical/20 border border-status-critical/40">
                                            <div className="w-1.5 h-1.5 rounded-full bg-status-critical" />
                                            <span className="text-[10px] font-medium text-status-critical">{criticalSystems}</span>
                                        </div>
                                    )}
                                    {warningSystems > 0 && (
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-status-warning/20 border border-status-warning/40">
                                            <div className="w-1.5 h-1.5 rounded-full bg-status-warning" />
                                            <span className="text-[10px] font-medium text-status-warning">{warningSystems}</span>
                                        </div>
                                    )}
                                    {criticalSystems === 0 && warningSystems === 0 && (
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-status-ok/20 border border-status-ok/40">
                                            <div className="w-1.5 h-1.5 rounded-full bg-status-ok" />
                                            <span className="text-[10px] font-medium text-status-ok">OK</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status bar */}
                            <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
                                <div 
                                    className={clsx(
                                        "h-full transition-all duration-300",
                                        category.status === 'ok' && 'bg-status-ok',
                                        category.status === 'warning' && 'bg-status-warning',
                                        category.status === 'critical' && 'bg-status-critical'
                                    )}
                                    style={{ 
                                        width: category.status === 'ok' ? '100%' : 
                                               category.status === 'warning' ? '70%' : '40%'
                                    }}
                                />
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Footer info */}
            <div className="p-4 border-t border-mars-border bg-mars-elevated">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Total Categories</span>
                    <span className="font-semibold text-gray-200">{categories.length}</span>
                </div>
            </div>
        </div>
    );
}

