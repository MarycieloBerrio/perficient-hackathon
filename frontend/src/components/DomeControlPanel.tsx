import { DomeCategory, DomeSystem, Subsystem, Control } from '../types';
import { clsx } from 'clsx';
import { ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useColony } from '../context/ColonyContext';

// Import control components
import { SliderControl } from './atoms/controls/SliderControl';
import { ToggleSafetySwitch } from './atoms/controls/ToggleSafetySwitch';
import { KnobControl } from './atoms/controls/KnobControl';
import { RadioButtonGroup } from './atoms/controls/RadioButtonGroup';
import { VerticalSlider } from './atoms/controls/VerticalSlider';
import { StepperInput } from './atoms/controls/StepperInput';
import { ButtonMatrix } from './atoms/controls/ButtonMatrix';
import { ProgressBarControl } from './atoms/controls/ProgressBarControl';
import { PushButton } from './atoms/controls/PushButton';
import { JoystickControl } from './atoms/controls/JoystickControl';

interface DomeControlPanelProps {
    category: DomeCategory | null;
    onControlChange: (controlId: string, value: any) => void;
}

export function DomeControlPanel({ category, onControlChange }: DomeControlPanelProps) {
    const [expandedSystems, setExpandedSystems] = useState<string[]>([]);
    const { telemetry, controlStates } = useColony();
    
    // Actualizar valores de controles desde telemetría
    useEffect(() => {
        if (!category) return;
        
        // Recorrer sistemas y actualizar controles con datos de telemetría
        category.systems.forEach(system => {
            system.subsystems.forEach(subsystem => {
                // Actualizar commander control
                updateControlWithTelemetry(subsystem.commanderControl);
                // Actualizar engineer control si existe
                if (subsystem.engineerControl) {
                    updateControlWithTelemetry(subsystem.engineerControl);
                }
            });
        });
    }, [category, telemetry]);

    const updateControlWithTelemetry = (control: Control) => {
        // Si el control es un sensor, actualizar su valor desde telemetría
        if (control.id.startsWith('sensor-')) {
            const sensorId = control.id.replace('sensor-', '');
            const reading = telemetry[sensorId];
            if (reading && typeof control.value === 'number') {
                control.value = reading.value;
            }
        }
        
        // Si el control tiene un estado guardado, usarlo
        if (controlStates[control.id] !== undefined) {
            control.value = controlStates[control.id];
        }
    };

    const toggleSystem = (systemId: string) => {
        setExpandedSystems(prev =>
            prev.includes(systemId)
                ? prev.filter(id => id !== systemId)
                : [...prev, systemId]
        );
    };

    const renderControl = (control: Control, level: 'commander' | 'engineer') => {
        const commonProps = {
            id: control.id,
            status: control.status,
            locked: control.locked,
            onChange: (value: any) => onControlChange(control.id, value)
        };

        switch (control.type) {
            case 'slider':
                return (
                    <SliderControl
                        {...commonProps}
                        label={control.label}
                        value={control.value as number}
                        min={control.min!}
                        max={control.max!}
                        step={control.step!}
                        unit={control.unit}
                    />
                );

            case 'safety-toggle':
            case 'toggle':
                return (
                    <ToggleSafetySwitch
                        {...commonProps}
                        label={control.label}
                        description={control.description}
                        value={control.value as boolean}
                        critical={control.critical}
                        requiresConfirmation={control.requiresConfirmation}
                    />
                );

            case 'knob':
                return (
                    <KnobControl
                        {...commonProps}
                        label={control.label}
                        value={control.value as number}
                        min={control.min!}
                        max={control.max!}
                        unit={control.unit}
                    />
                );

            case 'radio':
                return (
                    <RadioButtonGroup
                        {...commonProps}
                        label={control.label}
                        value={control.value as string}
                        options={control.options!}
                    />
                );

            case 'vertical-slider':
                return (
                    <VerticalSlider
                        {...commonProps}
                        label={control.label}
                        value={control.value as number}
                        min={control.min!}
                        max={control.max!}
                        step={control.step!}
                        unit={control.unit}
                    />
                );

            case 'stepper':
                return (
                    <StepperInput
                        {...commonProps}
                        label={control.label}
                        value={control.value as number}
                        min={control.min!}
                        max={control.max!}
                        step={control.step!}
                        unit={control.unit}
                    />
                );

            case 'matrix':
                return (
                    <ButtonMatrix
                        {...commonProps}
                        label={control.label}
                        matrix={control.matrix!}
                        onChange={(buttonId: string, enabled: boolean) => {
                            onControlChange(`${control.id}.${buttonId}`, enabled);
                        }}
                    />
                );

            case 'progress-bar':
                return (
                    <ProgressBarControl
                        {...commonProps}
                        label={control.label}
                        value={control.value as number}
                        min={control.min!}
                        max={control.max!}
                        unit={control.unit}
                    />
                );

            case 'push-button':
                return (
                    <PushButton
                        {...commonProps}
                        label={control.label}
                        description={control.description}
                        critical={control.critical}
                        requiresConfirmation={control.requiresConfirmation}
                        onPress={() => onControlChange(control.id, true)}
                    />
                );

            case 'joystick':
                return (
                    <JoystickControl
                        {...commonProps}
                        label={control.label}
                        value={control.value as number}
                        min={control.min!}
                        max={control.max!}
                        unit={control.unit}
                    />
                );

            default:
                return <div className="text-muted-foreground text-sm">Unknown control type</div>;
        }
    };

    const renderSubsystem = (subsystem: Subsystem) => {
        return (
            <div key={subsystem.id} className="space-y-6 p-6 bg-mars-elevated rounded-md border border-gray-700">
                <h4 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-gray-700">
                    {subsystem.name}
                </h4>

                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <h5 className="text-xs font-semibold text-primary uppercase tracking-wider">
                            Commander Control
                        </h5>
                    </div>
                    <div className="pl-4">
                        {renderControl(subsystem.commanderControl, 'commander')}
                    </div>
                </div>

                {subsystem.engineerControl && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-amber-600" />
                            <h5 className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                                Engineer Control
                            </h5>
                        </div>
                        <div className="pl-4">
                            {renderControl(subsystem.engineerControl, 'engineer')}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderSystem = (system: DomeSystem) => {
        const isExpanded = expandedSystems.includes(system.id);

        return (
            <div key={system.id} className="border border-gray-700 rounded-md overflow-hidden">
                {/* System header */}
                <button
                    onClick={() => toggleSystem(system.id)}
                    className={clsx(
                        "w-full p-4 flex items-center justify-between transition-colors",
                        "hover:bg-gray-800/40 cursor-pointer",
                        isExpanded ? 'bg-mars-elevated' : 'bg-mars-surface'
                    )}
                >
                    <div className="flex items-center gap-3">
                        {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-primary" />
                        ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                        <div className="text-left">
                            <h3 className="text-base font-semibold text-foreground">
                                {system.name}
                            </h3>
                            <p className="text-xs text-gray-400">
                                {system.description}
                            </p>
                        </div>
                    </div>

                    {/* Status indicator */}
                    <div className={clsx(
                        "px-3 py-1 rounded-md text-xs font-medium uppercase tracking-wider",
                        system.status === 'ok' && 'bg-status-ok/20 text-status-ok border border-status-ok/40',
                        system.status === 'warning' && 'bg-status-warning/20 text-status-warning border border-status-warning/40',
                        system.status === 'critical' && 'bg-status-critical/20 text-status-critical border border-status-critical/40'
                    )}>
                        {system.status}
                    </div>
                </button>

                {/* Subsystems */}
                {isExpanded && (
                    <div className="p-4 space-y-4 bg-mars-bg">
                        {system.subsystems.map(renderSubsystem)}
                    </div>
                )}
            </div>
        );
    };

    if (!category) {
        return (
            <div className="h-full bg-mars-surface flex items-center justify-center p-8 text-center">
                <div className="max-w-md">
                    <AlertTriangle className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2 text-foreground">No Category Selected</h3>
                    <p className="text-sm text-gray-400">
                        Select a control category from the left panel to view and manage its systems.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-mars-surface flex flex-col">
            {/* Category header */}
            <div className="p-6 border-b border-mars-border bg-mars-elevated">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-semibold text-foreground">
                        {category.name}
                    </h2>
                    <div className={clsx(
                        "px-3 py-1 rounded-md text-xs font-medium uppercase tracking-wider",
                        category.status === 'ok' && 'bg-status-ok/20 text-status-ok border border-status-ok/40',
                        category.status === 'warning' && 'bg-status-warning/20 text-status-warning border border-status-warning/40',
                        category.status === 'critical' && 'bg-status-critical/20 text-status-critical border border-status-critical/40'
                    )}>
                        {category.status}
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Priority: <strong className="text-gray-200">{category.priority.toUpperCase()}</strong></span>
                    <span>•</span>
                    <span>{category.systems.length} Systems</span>
                </div>
            </div>

            {/* Systems list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {category.systems.map(renderSystem)}
            </div>
        </div>
    );
}

