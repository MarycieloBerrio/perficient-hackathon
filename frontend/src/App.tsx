import { useState, useEffect } from 'react';
import { MapPanel } from './components/MapPanel';
import { DomeCategoryPanel } from './components/DomeCategoryPanel';
import { DomeControlPanel } from './components/DomeControlPanel';
import { AlertsPanel } from './components/AlertsPanel';
import { AresLogo } from './components/AresLogo';
import { Dome, DomeCategory } from './types';
import { clsx } from 'clsx';
import { Globe, Clock, ArrowLeft, AlertTriangle, CheckCircle, Bell } from 'lucide-react';
import { useColony } from './context/ColonyContext';
import { Toaster } from 'react-hot-toast';
import { useToast } from './hooks/useToast';

/**
 * Main application component for Mars Dome Control System
 * Manages dome selection, category navigation, and system status monitoring
 */

const MARS_SOL_DURATION_SECONDS = 88775.244;
const MARS_YEAR_SOLS = 669;
const CLOCK_UPDATE_INTERVAL_MS = 1000;

const GLOBAL_STATUS_STYLES = {
    ok: "border-green-700/40 text-green-600 bg-green-950/30",
    warning: "border-amber-700/40 text-amber-600 bg-amber-950/30",
    critical: "border-red-700/40 text-red-600 bg-red-950/30"
} as const;

export default function App() {
    const { domes: domesState, alerts, updateControlState, isLoading } = useColony();
    const [selectedDome, setSelectedDome] = useState<Dome | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<DomeCategory | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showAlerts, setShowAlerts] = useState(false);
    const toast = useToast();

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), CLOCK_UPDATE_INTERVAL_MS);
        return () => clearInterval(timer);
    }, []);

    const earthTime = currentTime.toUTCString().split(' ')[4];
    const marsDay = Math.floor((currentTime.getTime() / 1000 / MARS_SOL_DURATION_SECONDS) % MARS_YEAR_SOLS);

    const handleDomeSelect = (dome: Dome) => {
        setSelectedDome(dome);
        setSelectedCategory(null);
    };

    const handleBackToMap = () => {
        setSelectedDome(null);
        setSelectedCategory(null);
    };

    const handleCategorySelect = (category: DomeCategory) => {
        setSelectedCategory(category);
    };

    const handleControlChange = (controlId: string, value: any) => {
        try {
            updateControlState(controlId, value);
            
            // Show confirmation toast
            const controlName = controlId.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            
            // Format value for toast
            let displayValue = value;
            if (typeof value === 'boolean') {
                displayValue = value ? 'ON' : 'OFF';
            } else if (typeof value === 'number') {
                displayValue = value.toFixed(1);
            }
            
            toast.success(`${controlName}: ${displayValue}`, {
                duration: 2000,
            });
        } catch (error) {
            toast.error('Error updating control', {
                duration: 3000,
            });
        }
    };

    const getGlobalStatus = () => {
        const criticalDomes = domesState.filter(d => d.status === 'critical').length;
        const warningDomes = domesState.filter(d => d.status === 'warning').length;
        
        if (criticalDomes > 0) return 'critical';
        if (warningDomes > 0) return 'warning';
        return 'ok';
    };

    const globalStatus = getGlobalStatus();
    const activeAlerts = alerts.filter(a => a.is_active && !a.acknowledged);

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-mars-bg">
                <div className="text-center">
                    <div className="mb-8 flex justify-center">
                        <AresLogo size="large" showSubtitle={true} />
                    </div>
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">Initializing system...</p>
                    <p className="text-xs text-gray-500 mt-2">Loading colony data</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-mars-bg">
            <Toaster />
            <AlertsPanel isOpen={showAlerts} onClose={() => setShowAlerts(false)} />
            <header className={clsx(
                "h-16 border-b border-mars-border backdrop-blur-sm px-6 flex items-center justify-between",
                "bg-mars-elevated/95 transition-all"
            )}>
                <div className="flex items-center gap-4">
                    {selectedDome ? (
                        <>
                            <button
                                onClick={handleBackToMap}
                                className="p-2 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-primary font-bold tracking-wider">ARES</span>
                                    <span className="text-gray-600">|</span>
                                    <h1 className="text-lg font-semibold leading-none text-foreground">{selectedDome.name}</h1>
                                </div>
                                <span className="text-xs text-gray-400">
                                    Population: {selectedDome.population} • Status: {selectedDome.status.toUpperCase()}
                                </span>
                            </div>
                        </>
                    ) : (
                        <AresLogo size="medium" showSubtitle={true} />
                    )}
                </div>

                <div className="flex gap-8">
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase font-medium">Earth (UTC)</div>
                            <div className="font-mono text-sm text-gray-200">{earthTime}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase font-medium">Mars (SOL)</div>
                            <div className="font-mono text-sm text-gray-200">SOL {marsDay}</div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowAlerts(true)}
                        className={clsx(
                            "px-4 py-2 rounded-md border flex items-center gap-2 transition-colors relative",
                            activeAlerts.length > 0
                                ? "border-amber-700/40 text-amber-600 bg-amber-950/30 hover:bg-amber-950/50"
                                : "border-gray-700/40 text-gray-400 bg-gray-950/30 hover:bg-gray-950/50"
                        )}
                    >
                        <Bell className="w-4 h-4" />
                        <span className="font-medium text-sm">
                            {activeAlerts.length > 0 ? `${activeAlerts.length} Alerts` : 'No Alerts'}
                        </span>
                        {activeAlerts.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full text-xs text-white flex items-center justify-center font-bold">
                                {activeAlerts.length}
                            </span>
                        )}
                    </button>

                    <div className={clsx(
                        "px-4 py-2 rounded-md border flex items-center gap-2 transition-colors",
                        GLOBAL_STATUS_STYLES[globalStatus]
                    )}>
                        {globalStatus === 'ok' ? (
                            <CheckCircle className="w-4 h-4" />
                        ) : (
                            <AlertTriangle className="w-4 h-4" />
                        )}
                        <span className="font-medium text-sm capitalize">
                            System {globalStatus}
                        </span>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {!selectedDome ? (
                    <MapPanel
                        domes={domesState}
                        selectedDomeId={null}
                        onDomeSelect={handleDomeSelect}
                        marsImageUrl="/Mars.jpeg"
                        fullscreen={true}
                    />
                ) : (
                    <>
                        <div className="w-[30%] min-w-[350px]">
                            <DomeCategoryPanel
                                categories={selectedDome.categories}
                                selectedCategoryId={selectedCategory?.id || null}
                                onCategorySelect={handleCategorySelect}
                            />
                        </div>

                        <div className="flex-1">
                            <DomeControlPanel
                                category={selectedCategory}
                                onControlChange={handleControlChange}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
