import { Dome, Resource } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { clsx } from 'clsx';
import { Power, Activity, Shield, Wind } from 'lucide-react';

interface DetailPanelProps {
    selectedDome: Dome | null;
    selectedResource: Resource | null;
    onActuatorToggle: (domeId: string, actuatorName: string) => void;
}

export function DetailPanel({ selectedDome, selectedResource, onActuatorToggle }: DetailPanelProps) {
    if (selectedResource) {
        return (
            <div className="h-full bg-card/30 border-l border-border p-6 flex flex-col">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-1">{selectedResource.name}</h2>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-mono font-bold text-primary">{selectedResource.value}</span>
                        <span className="text-muted-foreground">{selectedResource.unit}</span>
                    </div>
                </div>

                <div className="flex-1 min-h-[300px] bg-card/50 rounded-lg border border-border p-4 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={selectedResource.historicalData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="time" stroke="#888888" fontSize={12} />
                            <YAxis stroke="#888888" fontSize={12} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.1)' }}
                                itemStyle={{ color: '#e5e5e5' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-accent/50">
                        <div className="text-xs text-muted-foreground uppercase">Status</div>
                        <div className={clsx(
                            "font-bold uppercase mt-1",
                            selectedResource.status === 'ok' && "text-green-500",
                            selectedResource.status === 'warning' && "text-yellow-500",
                            selectedResource.status === 'critical' && "text-destructive"
                        )}>
                            {selectedResource.status}
                        </div>
                    </div>
                    <div className="p-4 rounded-lg bg-accent/50">
                        <div className="text-xs text-muted-foreground uppercase">Trend</div>
                        <div className="font-bold mt-1 text-foreground">Stable</div>
                    </div>
                </div>
            </div>
        );
    }

    if (selectedDome) {
        return (
            <div className="h-full bg-card/30 border-l border-border p-6 overflow-y-auto">
                <div className="mb-6 pb-6 border-b border-border">
                    <h2 className="text-2xl font-bold">{selectedDome.name}</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <div className={clsx(
                            "w-2 h-2 rounded-full",
                            selectedDome.status === 'ok' && "bg-green-500",
                            selectedDome.status === 'warning' && "bg-yellow-500",
                            selectedDome.status === 'critical' && "bg-destructive"
                        )} />
                        <span className="text-sm text-muted-foreground uppercase tracking-wider">
                            System Status: {selectedDome.status}
                        </span>
                    </div>
                </div>

                {/* Systems Grid */}
                <div className="grid grid-cols-1 gap-4 mb-8">
                    {selectedDome.systems.map((sys, idx) => (
                        <div key={idx} className="p-4 rounded-lg bg-card border border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded bg-accent text-accent-foreground">
                                    {idx === 0 ? <Wind className="w-4 h-4" /> :
                                        idx === 1 ? <Power className="w-4 h-4" /> :
                                            <Shield className="w-4 h-4" />}
                                </div>
                                <div>
                                    <div className="text-sm font-medium">{sys.name}</div>
                                    <div className="text-xs text-muted-foreground">{sys.value}</div>
                                </div>
                            </div>
                            <div className={clsx(
                                "px-2 py-1 rounded text-xs font-bold uppercase",
                                sys.status === 'ok' && "bg-green-500/20 text-green-500",
                                sys.status === 'warning' && "bg-yellow-500/20 text-yellow-500",
                                sys.status === 'critical' && "bg-destructive/20 text-destructive"
                            )}>
                                {sys.status}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actuators */}
                <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Manual Override</h3>
                    <div className="space-y-3">
                        {selectedDome.actuators.map((actuator, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
                                <span className="font-medium text-sm">{actuator.name}</span>
                                <button
                                    onClick={() => onActuatorToggle(selectedDome.id, actuator.name)}
                                    className={clsx(
                                        "w-12 h-6 rounded-full transition-colors relative",
                                        actuator.enabled ? "bg-primary" : "bg-muted"
                                    )}
                                >
                                    <div className={clsx(
                                        "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                                        actuator.enabled ? "left-7" : "left-1"
                                    )} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-card/30 border-l border-border flex items-center justify-center p-8 text-center">
            <div className="max-w-xs">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-bold mb-2">No Selection</h3>
                <p className="text-sm text-muted-foreground">
                    Select a dome from the map or a resource from the telemetry menu to view details.
                </p>
            </div>
        </div>
    );
}
