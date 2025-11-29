export type AlertStatus = 'ok' | 'warning' | 'critical';

export type ControlType = 
  | 'slider' 
  | 'toggle' 
  | 'knob' 
  | 'radio' 
  | 'stepper' 
  | 'matrix' 
  | 'joystick'
  | 'vertical-slider'
  | 'progress-bar'
  | 'push-button'
  | 'safety-toggle';

export interface Dome {
  id: string;
  name: string;
  position: { x: number; y: number };
  status: AlertStatus;
  population: number;
  systems: {
    name: string;
    value: string;
    status: AlertStatus;
  }[];
  categories: DomeCategory[];
}

export interface DomeCategory {
  id: string;
  name: string;
  icon: string;
  status: AlertStatus;
  priority: 'immediate' | 'high' | 'medium' | 'low';
  systems: DomeSystem[];
}

export interface DomeSystem {
  id: string;
  name: string;
  description: string;
  status: AlertStatus;
  subsystems: Subsystem[];
}

export interface Subsystem {
  id: string;
  name: string;
  commanderControl: Control;
  engineerControl?: Control;
}

export interface Control {
  id: string;
  label: string;
  description: string;
  type: ControlType;
  value: number | boolean | string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: string[];
  status: AlertStatus;
  locked: boolean;
  critical: boolean;
  requiresConfirmation: boolean;
  matrix?: MatrixButton[][];
}

export interface MatrixButton {
  id: string;
  label: string;
  enabled: boolean;
  status: AlertStatus;
}

export interface Resource {
  id: string;
  name: string;
  value: string;
  unit: string;
  status: AlertStatus;
  sparklineData: number[];
  historicalData: { time: string; value: number }[];
}

export interface System {
  id: string;
  name: string;
  resources: Resource[];
}

export interface Category {
  id: string;
  name: string;
  systems: System[];
}
