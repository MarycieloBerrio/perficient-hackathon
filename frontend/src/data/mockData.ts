import { Dome, Category, AlertStatus } from '../types';

// Helper para generar datos de tendencia
const generateTrend = (base: number, variance: number, points = 24) => {
    return Array.from({ length: points }, (_, i) => ({
        time: `${i}:00`,
        value: base + (Math.random() - 0.5) * variance
    }));
};

// Helper para generar sparklines
const generateSparkline = (base: number, variance: number, points = 20) => {
    return Array.from({ length: points }, () => base + (Math.random() - 0.5) * variance);
};

export const domes: Dome[] = [
    {
        id: 'dome-alpha',
        name: 'Dome Alpha',
        position: { x: 35, y: 45 },
        status: 'ok',
        systems: [
            { name: 'Soporte Vital', value: '98%', status: 'ok' },
            { name: 'Energía', value: '450kW', status: 'ok' },
            { name: 'Escudos', value: '100%', status: 'ok' },
            { name: 'Suministros', value: '85%', status: 'ok' }
        ],
        actuators: [
            { name: 'Depurador CO₂', enabled: true },
            { name: 'Conversor MOXIE', enabled: true },
            { name: 'Reciclador de Agua', enabled: true },
            { name: 'Esclusa de Emergencia', enabled: false },
            { name: 'Válvula O₂ Interconexión', enabled: false },
            { name: 'Corte Laboratorios', enabled: false }
        ]
    },
    {
        id: 'dome-beta',
        name: 'Dome Beta',
        position: { x: 60, y: 55 },
        status: 'warning',
        systems: [
            { name: 'Soporte Vital', value: '85%', status: 'warning' },
            { name: 'Energía', value: '320kW', status: 'ok' },
            { name: 'Escudos', value: '95%', status: 'ok' },
            { name: 'Suministros', value: '72%', status: 'warning' }
        ],
        actuators: [
            { name: 'Depurador CO₂', enabled: true },
            { name: 'Conversor MOXIE', enabled: false },
            { name: 'Reciclador de Agua', enabled: false },
            { name: 'Esclusa de Emergencia', enabled: false },
            { name: 'Válvula O₂ Interconexión', enabled: true },
            { name: 'Corte Laboratorios', enabled: false }
        ]
    },
    {
        id: 'dome-gamma',
        name: 'Dome Gamma',
        position: { x: 45, y: 70 },
        status: 'critical',
        systems: [
            { name: 'Soporte Vital', value: '45%', status: 'critical' },
            { name: 'Energía', value: '150kW', status: 'warning' },
            { name: 'Escudos', value: '60%', status: 'critical' },
            { name: 'Suministros', value: '38%', status: 'critical' }
        ],
        actuators: [
            { name: 'Depurador CO₂', enabled: false },
            { name: 'Conversor MOXIE', enabled: true },
            { name: 'Reciclador de Agua', enabled: true },
            { name: 'Esclusa de Emergencia', enabled: true },
            { name: 'Válvula O₂ Interconexión', enabled: true },
            { name: 'Corte Laboratorios', enabled: true }
        ]
    }
];

export const categories: Category[] = [
    // 1. SISTEMA DE SOPORTE VITAL (ECLSS)
    {
        id: 'life-support',
        name: 'Soporte Vital (ECLSS)',
        systems: [
            {
                id: 'atmosphere',
                name: 'Atmósfera y Aire',
                resources: [
                    {
                        id: 'o2-level',
                        name: 'Nivel de Oxígeno',
                        value: '21',
                        unit: '%',
                        status: 'ok',
                        sparklineData: generateSparkline(21, 0.5),
                        historicalData: generateTrend(21, 0.5)
                    },
                    {
                        id: 'o2-reserves',
                        name: 'Reservas O₂ Líquido',
                        value: '450',
                        unit: 'kg',
                        status: 'ok',
                        sparklineData: generateSparkline(450, 20),
                        historicalData: generateTrend(450, 20)
                    },
                    {
                        id: 'co2-level',
                        name: 'Nivel de CO₂',
                        value: '420',
                        unit: 'ppm',
                        status: 'warning',
                        sparklineData: generateSparkline(420, 50),
                        historicalData: generateTrend(420, 50)
                    },
                    {
                        id: 'moxie-status',
                        name: 'Conversor MOXIE',
                        value: '92',
                        unit: '% Eficiencia',
                        status: 'ok',
                        sparklineData: generateSparkline(92, 3),
                        historicalData: generateTrend(92, 3)
                    },
                    {
                        id: 'gas-buffer',
                        name: 'Gas Buffer (N₂/Ar)',
                        value: '78',
                        unit: '%',
                        status: 'ok',
                        sparklineData: generateSparkline(78, 1),
                        historicalData: generateTrend(78, 1)
                    },
                    {
                        id: 'pressure',
                        name: 'Presión Atmosférica',
                        value: '101.3',
                        unit: 'kPa',
                        status: 'ok',
                        sparklineData: generateSparkline(101.3, 2),
                        historicalData: generateTrend(101.3, 2)
                    }
                ]
            },
            {
                id: 'water',
                name: 'Gestión del Agua',
                resources: [
                    {
                        id: 'potable-water',
                        name: 'Agua Potable',
                        value: '4500',
                        unit: 'L',
                        status: 'ok',
                        sparklineData: generateSparkline(4500, 200),
                        historicalData: generateTrend(4500, 200)
                    },
                    {
                        id: 'grey-water',
                        name: 'Aguas Grises',
                        value: '850',
                        unit: 'L',
                        status: 'ok',
                        sparklineData: generateSparkline(850, 100),
                        historicalData: generateTrend(850, 100)
                    },
                    {
                        id: 'black-water',
                        name: 'Aguas Negras',
                        value: '320',
                        unit: 'L',
                        status: 'warning',
                        sparklineData: generateSparkline(320, 50),
                        historicalData: generateTrend(320, 50)
                    },
                    {
                        id: 'ice-reserves',
                        name: 'Hielo Marciano',
                        value: '2400',
                        unit: 'kg',
                        status: 'ok',
                        sparklineData: generateSparkline(2400, 100),
                        historicalData: generateTrend(2400, 100)
                    },
                    {
                        id: 'humidity',
                        name: 'Humedad Relativa',
                        value: '45',
                        unit: '%',
                        status: 'ok',
                        sparklineData: generateSparkline(45, 5),
                        historicalData: generateTrend(45, 5)
                    }
                ]
            },
            {
                id: 'thermal',
                name: 'Regulación Térmica',
                resources: [
                    {
                        id: 'internal-temp',
                        name: 'Temperatura Interna',
                        value: '22',
                        unit: '°C',
                        status: 'ok',
                        sparklineData: generateSparkline(22, 2),
                        historicalData: generateTrend(22, 2)
                    },
                    {
                        id: 'thermal-shields',
                        name: 'Escudos Térmicos',
                        value: '98',
                        unit: '%',
                        status: 'ok',
                        sparklineData: generateSparkline(98, 1),
                        historicalData: generateTrend(98, 1)
                    }
                ]
            }
        ]
    },

    // 2. ENERGÍA Y POTENCIA
    {
        id: 'energy',
        name: 'Energía y Potencia',
        systems: [
            {
                id: 'solar',
                name: 'Generación Solar',
                resources: [
                    {
                        id: 'solar-efficiency',
                        name: 'Eficiencia de Paneles',
                        value: '87',
                        unit: '%',
                        status: 'ok',
                        sparklineData: generateSparkline(87, 5),
                        historicalData: generateTrend(87, 5)
                    },
                    {
                        id: 'solar-output',
                        name: 'Output Solar',
                        value: '125',
                        unit: 'kW',
                        status: 'ok',
                        sparklineData: generateSparkline(125, 15),
                        historicalData: generateTrend(125, 15)
                    },
                    {
                        id: 'dust-accumulation',
                        name: 'Polvo Acumulado',
                        value: '12',
                        unit: '%',
                        status: 'warning',
                        sparklineData: generateSparkline(12, 3),
                        historicalData: generateTrend(12, 3)
                    }
                ]
            },
            {
                id: 'nuclear',
                name: 'Generación Nuclear',
                resources: [
                    {
                        id: 'reactor-temp',
                        name: 'Temperatura del Reactor',
                        value: '580',
                        unit: '°C',
                        status: 'ok',
                        sparklineData: generateSparkline(580, 10),
                        historicalData: generateTrend(580, 10)
                    },
                    {
                        id: 'nuclear-output',
                        name: 'Output Nuclear',
                        value: '850',
                        unit: 'kW',
                        status: 'ok',
                        sparklineData: generateSparkline(850, 5),
                        historicalData: generateTrend(850, 5)
                    },
                    {
                        id: 'fuel-life',
                        name: 'Vida Útil Combustible',
                        value: '2847',
                        unit: 'días',
                        status: 'ok',
                        sparklineData: generateSparkline(2847, 1),
                        historicalData: generateTrend(2847, 1)
                    }
                ]
            },
            {
                id: 'hydrogen',
                name: 'Celdas de Hidrógeno',
                resources: [
                    {
                        id: 'h2-reserves',
                        name: 'Reservas de H₂',
                        value: '180',
                        unit: 'kg',
                        status: 'ok',
                        sparklineData: generateSparkline(180, 10),
                        historicalData: generateTrend(180, 10)
                    },
                    {
                        id: 'h2-output',
                        name: 'Output H₂',
                        value: '45',
                        unit: 'kW',
                        status: 'ok',
                        sparklineData: generateSparkline(45, 5),
                        historicalData: generateTrend(45, 5)
                    }
                ]
            }
        ]
    },

    // 3. SUMINISTROS E INVENTARIO
    {
        id: 'supplies',
        name: 'Suministros e Inventario',
        systems: [
            {
                id: 'food',
                name: 'Alimentación',
                resources: [
                    {
                        id: 'emergency-rations',
                        name: 'Raciones de Emergencia',
                        value: '180',
                        unit: 'días',
                        status: 'ok',
                        sparklineData: generateSparkline(180, 5),
                        historicalData: generateTrend(180, 5)
                    },
                    {
                        id: 'crops',
                        name: 'Cultivos Activos',
                        value: '42',
                        unit: 'unidades',
                        status: 'ok',
                        sparklineData: generateSparkline(42, 3),
                        historicalData: generateTrend(42, 3)
                    },
                    {
                        id: 'biomass',
                        name: 'Biomasa Cosechada',
                        value: '125000',
                        unit: 'kcal',
                        status: 'ok',
                        sparklineData: generateSparkline(125000, 5000),
                        historicalData: generateTrend(125000, 5000)
                    },
                    {
                        id: 'nutrients',
                        name: 'Solución Nutritiva NPK',
                        value: '85',
                        unit: 'kg',
                        status: 'warning',
                        sparklineData: generateSparkline(85, 10),
                        historicalData: generateTrend(85, 10)
                    }
                ]
            },
            {
                id: 'materials',
                name: 'Materiales de Construcción',
                resources: [
                    {
                        id: 'regolith',
                        name: 'Regolito Procesado',
                        value: '12.5',
                        unit: 'ton',
                        status: 'ok',
                        sparklineData: generateSparkline(12.5, 1),
                        historicalData: generateTrend(12.5, 1)
                    },
                    {
                        id: 'filament',
                        name: 'Filamento para 3D',
                        value: '340',
                        unit: 'kg',
                        status: 'ok',
                        sparklineData: generateSparkline(340, 20),
                        historicalData: generateTrend(340, 20)
                    },
                    {
                        id: 'metal',
                        name: 'Metal Refinado',
                        value: '580',
                        unit: 'kg',
                        status: 'warning',
                        sparklineData: generateSparkline(580, 30),
                        historicalData: generateTrend(580, 30)
                    },
                    {
                        id: 'marscrete',
                        name: 'Marscrete',
                        value: '8.2',
                        unit: 'ton',
                        status: 'ok',
                        sparklineData: generateSparkline(8.2, 0.5),
                        historicalData: generateTrend(8.2, 0.5)
                    }
                ]
            },
            {
                id: 'spare-parts',
                name: 'Repuestos Críticos',
                resources: [
                    {
                        id: 'hepa-filters',
                        name: 'Filtros HEPA',
                        value: '28',
                        unit: 'unid',
                        status: 'ok',
                        sparklineData: generateSparkline(28, 2),
                        historicalData: generateTrend(28, 2)
                    },
                    {
                        id: 'circuit-chips',
                        name: 'Chips y Circuitos',
                        value: '145',
                        unit: 'unid',
                        status: 'ok',
                        sparklineData: generateSparkline(145, 10),
                        historicalData: generateTrend(145, 10)
                    },
                    {
                        id: 'eva-suits',
                        name: 'Trajes EVA',
                        value: '12',
                        unit: 'unid',
                        status: 'warning',
                        sparklineData: generateSparkline(12, 1),
                        historicalData: generateTrend(12, 1)
                    }
                ]
            }
        ]
    },

    // 4. INFRAESTRUCTURA Y SEGURIDAD
    {
        id: 'infrastructure',
        name: 'Infraestructura y Seguridad',
        systems: [
            {
                id: 'structural',
                name: 'Integridad Estructural',
                resources: [
                    {
                        id: 'hull-integrity',
                        name: 'Integridad del Casco',
                        value: '98.5',
                        unit: '%',
                        status: 'ok',
                        sparklineData: generateSparkline(98.5, 0.5),
                        historicalData: generateTrend(98.5, 0.5)
                    },
                    {
                        id: 'radiation-shield',
                        name: 'Blindaje de Radiación',
                        value: '45',
                        unit: 'cm equiv.',
                        status: 'ok',
                        sparklineData: generateSparkline(45, 1),
                        historicalData: generateTrend(45, 1)
                    },
                    {
                        id: 'micro-impacts',
                        name: 'Micro-impactos (24h)',
                        value: '3',
                        unit: 'detectados',
                        status: 'ok',
                        sparklineData: generateSparkline(3, 2),
                        historicalData: generateTrend(3, 2)
                    }
                ]
            },
            {
                id: 'external-sensors',
                name: 'Sensores Externos',
                resources: [
                    {
                        id: 'radiation-level',
                        name: 'Nivel de Radiación',
                        value: '0.24',
                        unit: 'Sv/h',
                        status: 'ok',
                        sparklineData: generateSparkline(0.24, 0.05),
                        historicalData: generateTrend(0.24, 0.05)
                    },
                    {
                        id: 'wind-speed',
                        name: 'Velocidad del Viento',
                        value: '45',
                        unit: 'km/h',
                        status: 'ok',
                        sparklineData: generateSparkline(45, 15),
                        historicalData: generateTrend(45, 15)
                    },
                    {
                        id: 'dust-storm',
                        name: 'Tormenta Cercana',
                        value: '850',
                        unit: 'km',
                        status: 'ok',
                        sparklineData: generateSparkline(850, 50),
                        historicalData: generateTrend(850, 50)
                    }
                ]
            }
        ]
    },

    // 5. RECURSOS HUMANOS Y SALUD
    {
        id: 'health',
        name: 'Recursos Humanos y Salud',
        systems: [
            {
                id: 'population',
                name: 'Población',
                resources: [
                    {
                        id: 'dome-alpha-crew',
                        name: 'Personal Domo Alpha',
                        value: '8',
                        unit: 'personas',
                        status: 'ok',
                        sparklineData: generateSparkline(8, 0),
                        historicalData: generateTrend(8, 0)
                    },
                    {
                        id: 'dome-beta-crew',
                        name: 'Personal Domo Beta',
                        value: '6',
                        unit: 'personas',
                        status: 'ok',
                        sparklineData: generateSparkline(6, 0),
                        historicalData: generateTrend(6, 0)
                    },
                    {
                        id: 'dome-gamma-crew',
                        name: 'Personal Domo Gamma',
                        value: '4',
                        unit: 'personas',
                        status: 'warning',
                        sparklineData: generateSparkline(4, 0),
                        historicalData: generateTrend(4, 0)
                    },
                    {
                        id: 'eva-personnel',
                        name: 'Personal en EVA',
                        value: '2',
                        unit: 'personas',
                        status: 'ok',
                        sparklineData: generateSparkline(2, 1),
                        historicalData: generateTrend(2, 1)
                    }
                ]
            },
            {
                id: 'medical',
                name: 'Suministros Médicos',
                resources: [
                    {
                        id: 'antibiotics',
                        name: 'Antibióticos',
                        value: '240',
                        unit: 'dosis',
                        status: 'ok',
                        sparklineData: generateSparkline(240, 10),
                        historicalData: generateTrend(240, 10)
                    },
                    {
                        id: 'analgesics',
                        name: 'Analgésicos',
                        value: '480',
                        unit: 'dosis',
                        status: 'ok',
                        sparklineData: generateSparkline(480, 20),
                        historicalData: generateTrend(480, 20)
                    },
                    {
                        id: 'medical-o2',
                        name: 'O₂ Médico',
                        value: '180',
                        unit: 'L',
                        status: 'warning',
                        sparklineData: generateSparkline(180, 15),
                        historicalData: generateTrend(180, 15)
                    }
                ]
            }
        ]
    }
];

export const getWorstStatus = (statuses: AlertStatus[]): AlertStatus => {
    if (statuses.includes('critical')) return 'critical';
    if (statuses.includes('warning')) return 'warning';
    return 'ok';
};
