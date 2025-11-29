import { ChevronRight, Activity } from 'lucide-react';
import { Category, Resource } from '../types';
import { clsx } from 'clsx';
import { useState } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface NavigationPanelProps {
    categories: Category[];
    onResourceSelect: (resource: Resource) => void;
    selectedResourceId: string | null;
}

export function NavigationPanel({ categories, onResourceSelect, selectedResourceId }: NavigationPanelProps) {
    const [expandedCats, setExpandedCats] = useState<string[]>(['life-support']);

    const toggleCat = (id: string) => {
        setExpandedCats(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    return (
        <div className="h-full border-r border-border bg-card/30 flex flex-col">
            <div className="p-4 border-b border-border">
                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Telemetry</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {categories.map(cat => (
                    <div key={cat.id} className="space-y-1">
                        <button
                            onClick={() => toggleCat(cat.id)}
                            className="w-full flex items-center justify-between p-2 rounded hover:bg-accent/50 transition-colors text-sm font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <ChevronRight className={clsx(
                                    "w-4 h-4 transition-transform",
                                    expandedCats.includes(cat.id) && "rotate-90"
                                )} />
                                {cat.name}
                            </div>
                        </button>

                        {expandedCats.includes(cat.id) && (
                            <div className="ml-2 pl-2 border-l border-border space-y-1">
                                {cat.systems.map(system => (
                                    <div key={system.id} className="space-y-1">
                                        <div className="px-2 py-1 text-xs text-muted-foreground font-semibold">
                                            {system.name}
                                        </div>
                                        {system.resources.map(resource => (
                                            <button
                                                key={resource.id}
                                                onClick={() => onResourceSelect(resource)}
                                                className={clsx(
                                                    "w-full text-left p-2 rounded text-sm transition-all group relative overflow-hidden",
                                                    selectedResourceId === resource.id
                                                        ? "bg-primary text-primary-foreground"
                                                        : "hover:bg-accent hover:text-accent-foreground"
                                                )}
                                            >
                                                <div className="flex justify-between items-center mb-1 relative z-10">
                                                    <span>{resource.name}</span>
                                                    <span className={clsx(
                                                        "font-mono font-bold",
                                                        resource.status === 'critical' && "text-destructive",
                                                        resource.status === 'warning' && "text-yellow-500",
                                                        selectedResourceId === resource.id && "text-primary-foreground"
                                                    )}>
                                                        {resource.value}
                                                    </span>
                                                </div>

                                                {/* Mini Sparkline */}
                                                <div className="h-6 w-full opacity-50">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <LineChart data={resource.sparklineData.map((v, i) => ({ v, i }))}>
                                                            <Line
                                                                type="monotone"
                                                                dataKey="v"
                                                                stroke={selectedResourceId === resource.id ? 'currentColor' : '#888888'}
                                                                strokeWidth={1.5}
                                                                dot={false}
                                                            />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
