import { Dome, DomeCategory, AlertStatus } from '../types';

// Categorías comunes para todos los domos
export const defaultCategories: DomeCategory[] = [
    // 1. ECLSS - Sistema de Soporte Vital
    {
        id: 'eclss',
        name: 'Life Support (ECLSS)',
        icon: 'Wind',
        status: 'ok' as AlertStatus,
        priority: 'immediate',
        systems: [
            {
                id: 'atmosphere',
                name: 'Atmosphere (O₂/CO₂)',
                description: 'Oxygen generation and CO₂ scrubbing systems',
                status: 'ok' as AlertStatus,
                subsystems: [
                    {
                        id: 'emergency-masks',
                        name: 'Emergency Protocol',
                        commanderControl: {
                            id: 'deploy-masks',
                            label: 'Deploy Emergency Masks',
                            description: 'Deploy oxygen masks across entire sector',
                            type: 'safety-toggle',
                            value: false,
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: true,
                            requiresConfirmation: true
                        },
                        engineerControl: {
                            id: 'moxie-voltage',
                            label: 'MOXIE Cell Voltage',
                            description: 'Adjust electrolysis cell voltage for O₂ production rate',
                            type: 'slider',
                            value: 850,
                            min: 600,
                            max: 1000,
                            step: 10,
                            unit: 'mV',
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: false,
                            requiresConfirmation: false
                        }
                    }
                ]
            },
            {
                id: 'pressure',
                name: 'Pressure Control',
                description: 'Atmospheric pressure regulation between domes',
                status: 'ok' as AlertStatus,
                subsystems: [
                    {
                        id: 'equalization',
                        name: 'Pressure Equalization',
                        commanderControl: {
                            id: 'equalize-domes',
                            label: 'Equalize Pressure',
                            description: 'Equalize pressure between Dome A and B',
                            type: 'push-button',
                            value: false,
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: false,
                            requiresConfirmation: false
                        },
                        engineerControl: {
                            id: 'pressure-rate',
                            label: 'Equalization Rate',
                            description: 'Control pressure equalization speed',
                            type: 'slider',
                            value: 50,
                            min: 10,
                            max: 100,
                            step: 5,
                            unit: '%',
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: false,
                            requiresConfirmation: false
                        }
                    }
                ]
            },
            {
                id: 'water',
                name: 'Water Management',
                description: 'Water recycling and rationing systems',
                status: 'ok' as AlertStatus,
                subsystems: [
                    {
                        id: 'rationing',
                        name: 'Water Rationing',
                        commanderControl: {
                            id: 'scarcity-mode',
                            label: 'Scarcity Mode',
                            description: 'Activate water rationing (cut showers/laundry)',
                            type: 'toggle',
                            value: false,
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: false,
                            requiresConfirmation: true
                        },
                        engineerControl: {
                            id: 'filter-source',
                            label: 'Filter Input Source',
                            description: 'Select water source for filtration system',
                            type: 'radio',
                            value: 'greywater',
                            options: ['greywater', 'blackwater', 'both'],
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: false,
                            requiresConfirmation: false
                        }
                    }
                ]
            },
            {
                id: 'thermal',
                name: 'Thermal Regulation',
                description: 'Temperature control and heat distribution',
                status: 'ok' as AlertStatus,
                subsystems: [
                    {
                        id: 'temperature',
                        name: 'Temperature Control',
                        commanderControl: {
                            id: 'temp-setpoint',
                            label: 'Global Temperature Setpoint',
                            description: 'Set target temperature for entire dome',
                            type: 'vertical-slider',
                            value: 21,
                            min: 18,
                            max: 26,
                            step: 0.5,
                            unit: '°C',
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: false,
                            requiresConfirmation: false
                        },
                        engineerControl: {
                            id: 'coolant-flow',
                            label: 'Coolant Pump Speed',
                            description: 'Liquid cooling pump flow rate',
                            type: 'slider',
                            value: 1200,
                            min: 800,
                            max: 2000,
                            step: 50,
                            unit: 'RPM',
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: false,
                            requiresConfirmation: false
                        }
                    }
                ]
            }
        ]
    },
    
    // 2. ENERGÍA Y POTENCIA
    {
        id: 'power',
        name: 'Energy & Power',
        icon: 'Zap',
        status: 'ok' as AlertStatus,
        priority: 'high',
        systems: [
            {
                id: 'distribution',
                name: 'Power Distribution',
                description: 'Load management and power routing',
                status: 'ok' as AlertStatus,
                subsystems: [
                    {
                        id: 'load-shedding',
                        name: 'Load Shedding',
                        commanderControl: {
                            id: 'shed-loads',
                            label: 'Emergency Load Shedding',
                            description: 'Shutdown non-essential systems (Research/Gym)',
                            type: 'safety-toggle',
                            value: false,
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: true,
                            requiresConfirmation: true
                        },
                        engineerControl: {
                            id: 'bus-routing',
                            label: 'Bus Transfer Switch',
                            description: 'Isolate Dome A from global grid',
                            type: 'toggle',
                            value: false,
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: true,
                            requiresConfirmation: true
                        }
                    }
                ]
            },
            {
                id: 'solar',
                name: 'Solar Generation',
                description: 'Solar panel control and positioning',
                status: 'ok' as AlertStatus,
                subsystems: [
                    {
                        id: 'panel-deploy',
                        name: 'Panel Deployment',
                        commanderControl: {
                            id: 'retract-panels',
                            label: 'Retract Solar Panels',
                            description: 'Emergency panel retraction (dust storm)',
                            type: 'push-button',
                            value: false,
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: true,
                            requiresConfirmation: true
                        },
                        engineerControl: {
                            id: 'panel-orientation',
                            label: 'Panel Orientation',
                            description: 'Adjust tilt/azimuth angle manually',
                            type: 'joystick',
                            value: 0,
                            min: -180,
                            max: 180,
                            unit: '°',
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: false,
                            requiresConfirmation: false
                        }
                    }
                ]
            },
            {
                id: 'nuclear',
                name: 'Nuclear Generation',
                description: 'Nuclear reactor control and safety',
                status: 'ok' as AlertStatus,
                subsystems: [
                    {
                        id: 'reactor-control',
                        name: 'Reactor Control',
                        commanderControl: {
                            id: 'scram',
                            label: 'SCRAM - Emergency Shutdown',
                            description: 'Full control rod insertion (emergency stop)',
                            type: 'safety-toggle',
                            value: false,
                            status: 'ok' as AlertStatus,
                            locked: true,
                            critical: true,
                            requiresConfirmation: true
                        },
                        engineerControl: {
                            id: 'control-rods',
                            label: 'Control Rod Height',
                            description: 'Fine-tune thermal output via rod position',
                            type: 'slider',
                            value: 65,
                            min: 0,
                            max: 100,
                            step: 1,
                            unit: '%',
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: true,
                            requiresConfirmation: false
                        }
                    }
                ]
            },
            {
                id: 'batteries',
                name: 'Battery Storage',
                description: 'Energy storage management',
                status: 'ok' as AlertStatus,
                subsystems: [
                    {
                        id: 'battery-mode',
                        name: 'Battery Mode',
                        commanderControl: {
                            id: 'charge-mode',
                            label: 'Battery Mode',
                            description: 'Switch between charge priority and grid discharge',
                            type: 'radio',
                            value: 'charge',
                            options: ['charge', 'discharge', 'auto'],
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: false,
                            requiresConfirmation: false
                        },
                        engineerControl: {
                            id: 'battery-banks',
                            label: 'Battery Bank Isolation',
                            description: 'Isolate individual damaged battery banks',
                            type: 'matrix',
                            value: 0,
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: false,
                            requiresConfirmation: false,
                            matrix: [
                                [
                                    { id: 'bank-a1', label: 'A1', enabled: true, status: 'ok' as AlertStatus },
                                    { id: 'bank-a2', label: 'A2', enabled: true, status: 'ok' as AlertStatus },
                                    { id: 'bank-a3', label: 'A3', enabled: true, status: 'warning' as AlertStatus }
                                ],
                                [
                                    { id: 'bank-b1', label: 'B1', enabled: true, status: 'ok' as AlertStatus },
                                    { id: 'bank-b2', label: 'B2', enabled: false, status: 'critical' as AlertStatus },
                                    { id: 'bank-b3', label: 'B3', enabled: true, status: 'ok' as AlertStatus }
                                ]
                            ]
                        }
                    }
                ]
            }
        ]
    },

    // 3. SUMINISTROS E INVENTARIO
    {
        id: 'supplies',
        name: 'Supplies & Inventory',
        icon: 'Package',
        status: 'ok' as AlertStatus,
        priority: 'medium',
        systems: [
            {
                id: 'agriculture',
                name: 'Agriculture',
                description: 'Crop management and harvest cycles',
                status: 'ok' as AlertStatus,
                subsystems: [
                    {
                        id: 'harvest',
                        name: 'Harvest Cycle',
                        commanderControl: {
                            id: 'mass-harvest',
                            label: 'Authorize Mass Harvest',
                            description: 'Harvest all crops for emergency reserves',
                            type: 'push-button',
                            value: false,
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: false,
                            requiresConfirmation: true
                        },
                        engineerControl: {
                            id: 'npk-injection',
                            label: 'NPK Solution Injection',
                            description: 'Manual nutrient solution dosing',
                            type: 'stepper',
                            value: 7.2,
                            min: 5.5,
                            max: 8.5,
                            step: 0.1,
                            unit: 'pH',
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: false,
                            requiresConfirmation: false
                        }
                    }
                ]
            },
            {
                id: 'lighting',
                name: 'Grow Lighting',
                description: 'Circadian and spectral light control',
                status: 'ok' as AlertStatus,
                subsystems: [
                    {
                        id: 'circadian',
                        name: 'Circadian Cycle',
                        commanderControl: {
                            id: 'day-night',
                            label: 'Day/Night Simulation',
                            description: 'Global day/night cycle control',
                            type: 'toggle',
                            value: true,
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: false,
                            requiresConfirmation: false
                        },
                        engineerControl: {
                            id: 'spectrum',
                            label: 'Light Spectrum',
                            description: 'Adjust wavelength for growth vs flowering',
                            type: 'radio',
                            value: 'balanced',
                            options: ['blue-growth', 'balanced', 'red-flowering'],
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: false,
                            requiresConfirmation: false
                        }
                    }
                ]
            }
        ]
    },

    // 4. INFRAESTRUCTURA Y SEGURIDAD
    {
        id: 'infrastructure',
        name: 'Infrastructure & Security',
        icon: 'Shield',
        status: 'ok' as AlertStatus,
        priority: 'high',
        systems: [
            {
                id: 'hull-integrity',
                name: 'Hull Integrity',
                description: 'Structural monitoring and breach response',
                status: 'ok' as AlertStatus,
                subsystems: [
                    {
                        id: 'sector-seal',
                        name: 'Sector Sealing',
                        commanderControl: {
                            id: 'seal-sector',
                            label: 'Emergency Sector Seal',
                            description: 'Lower isolation bulkheads on hull breach',
                            type: 'safety-toggle',
                            value: false,
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: true,
                            requiresConfirmation: true
                        },
                        engineerControl: {
                            id: 'repair-drones',
                            label: 'Deploy Repair Drones',
                            description: 'Send repair drones to specific coordinates',
                            type: 'stepper',
                            value: 0,
                            min: 0,
                            max: 10,
                            step: 1,
                            unit: 'drones',
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: false,
                            requiresConfirmation: false
                        }
                    }
                ]
            },
            {
                id: 'airlocks',
                name: 'Airlocks',
                description: 'Airlock cycle control and safety',
                status: 'ok' as AlertStatus,
                subsystems: [
                    {
                        id: 'lockdown',
                        name: 'Airlock Lockdown',
                        commanderControl: {
                            id: 'total-lockdown',
                            label: 'Total Lockdown',
                            description: 'Prevent all entry/exit operations',
                            type: 'safety-toggle',
                            value: false,
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: true,
                            requiresConfirmation: true
                        }
                    }
                ]
            },
            {
                id: 'sensors',
                name: 'External Sensors',
                description: 'Environmental monitoring systems',
                status: 'ok' as AlertStatus,
                subsystems: [
                    {
                        id: 'sensor-maintenance',
                        name: 'Sensor Maintenance',
                        commanderControl: {
                            id: 'electrostatic-clean',
                            label: 'Electrostatic Cleaning',
                            description: 'Activate dust removal on sensor lenses',
                            type: 'push-button',
                            value: false,
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: false,
                            requiresConfirmation: false
                        },
                        engineerControl: {
                            id: 'calibrate-rad',
                            label: 'Radiation Calibration',
                            description: 'Reset zero point for radiation sensors',
                            type: 'push-button',
                            value: false,
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: false,
                            requiresConfirmation: false
                        }
                    }
                ]
            }
        ]
    },

    // 5. RECURSOS HUMANOS Y SALUD
    {
        id: 'health',
        name: 'Human Resources & Health',
        icon: 'Heart',
        status: 'ok' as AlertStatus,
        priority: 'high',
        systems: [
            {
                id: 'access-control',
                name: 'Access & Security',
                description: 'Personnel access management',
                status: 'ok' as AlertStatus,
                subsystems: [
                    {
                        id: 'curfew',
                        name: 'Curfew Control',
                        commanderControl: {
                            id: 'martial-law',
                            label: 'Martial Law / Curfew',
                            description: 'Restrict access to common areas',
                            type: 'toggle',
                            value: false,
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: true,
                            requiresConfirmation: true
                        },
                        engineerControl: {
                            id: 'door-permissions',
                            label: 'Door Access Permissions',
                            description: 'Grant/revoke access to specific doors',
                            type: 'matrix',
                            value: 0,
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: false,
                            requiresConfirmation: false,
                            matrix: [
                                [
                                    { id: 'door-lab', label: 'LAB', enabled: true, status: 'ok' as AlertStatus },
                                    { id: 'door-med', label: 'MED', enabled: true, status: 'ok' as AlertStatus },
                                    { id: 'door-ops', label: 'OPS', enabled: true, status: 'ok' as AlertStatus }
                                ],
                                [
                                    { id: 'door-hab', label: 'HAB', enabled: true, status: 'ok' as AlertStatus },
                                    { id: 'door-rec', label: 'REC', enabled: true, status: 'ok' as AlertStatus },
                                    { id: 'door-eng', label: 'ENG', enabled: false, status: 'warning' as AlertStatus }
                                ]
                            ]
                        }
                    }
                ]
            },
            {
                id: 'eva',
                name: 'EVA Operations',
                description: 'Extravehicular activity management',
                status: 'ok' as AlertStatus,
                subsystems: [
                    {
                        id: 'eva-control',
                        name: 'EVA Control',
                        commanderControl: {
                            id: 'recall-signal',
                            label: 'EVA Recall Signal',
                            description: 'Send immediate return signal to all EVA suits',
                            type: 'push-button',
                            value: false,
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: true,
                            requiresConfirmation: true
                        },
                        engineerControl: {
                            id: 'suit-o2-mix',
                            label: 'Remote O₂ Mix Adjustment',
                            description: 'Adjust suit oxygen mixture remotely',
                            type: 'slider',
                            value: 21,
                            min: 18,
                            max: 100,
                            step: 1,
                            unit: '%',
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: true,
                            requiresConfirmation: false
                        }
                    }
                ]
            },
            {
                id: 'medical',
                name: 'Medical Systems',
                description: 'Medical facilities and emergency response',
                status: 'ok' as AlertStatus,
                subsystems: [
                    {
                        id: 'quarantine',
                        name: 'Quarantine',
                        commanderControl: {
                            id: 'bio-lockdown',
                            label: 'Biological Quarantine',
                            description: 'Lockdown medical bay for containment',
                            type: 'safety-toggle',
                            value: false,
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: true,
                            requiresConfirmation: true
                        },
                        engineerControl: {
                            id: 'medical-drone',
                            label: 'Dispatch Medical Drone',
                            description: 'Send first aid unit to GPS location',
                            type: 'push-button',
                            value: false,
                            status: 'ok' as AlertStatus,
                            locked: false,
                            critical: false,
                            requiresConfirmation: false
                        }
                    }
                ]
            }
        ]
    }
];

export const domes: Dome[] = [
    {
        id: 'dome-alpha',
        name: 'Dome Alpha',
        position: { x: 35, y: 45 },
        status: 'ok' as AlertStatus,
        population: 8,
        systems: [
            { name: 'Life Support', value: '98%', status: 'ok' as AlertStatus },
            { name: 'Power', value: '450kW', status: 'ok' as AlertStatus },
            { name: 'Structural', value: '100%', status: 'ok' as AlertStatus },
            { name: 'Supplies', value: '85%', status: 'ok' as AlertStatus }
        ],
        categories: defaultCategories
    },
    {
        id: 'dome-beta',
        name: 'Dome Beta',
        position: { x: 60, y: 55 },
        status: 'warning' as AlertStatus,
        population: 6,
        systems: [
            { name: 'Life Support', value: '85%', status: 'warning' as AlertStatus },
            { name: 'Power', value: '320kW', status: 'ok' as AlertStatus },
            { name: 'Structural', value: '95%', status: 'ok' as AlertStatus },
            { name: 'Supplies', value: '72%', status: 'warning' as AlertStatus }
        ],
        categories: defaultCategories
    },
    {
        id: 'dome-gamma',
        name: 'Dome Gamma',
        position: { x: 45, y: 70 },
        status: 'critical' as AlertStatus,
        population: 4,
        systems: [
            { name: 'Life Support', value: '45%', status: 'critical' as AlertStatus },
            { name: 'Power', value: '150kW', status: 'warning' as AlertStatus },
            { name: 'Structural', value: '60%', status: 'critical' as AlertStatus },
            { name: 'Supplies', value: '38%', status: 'critical' as AlertStatus }
        ],
        categories: defaultCategories
    }
];

