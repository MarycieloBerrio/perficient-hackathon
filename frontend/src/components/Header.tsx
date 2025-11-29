import { AlertTriangle, CheckCircle, Clock, Globe } from 'lucide-react';
import { AlertStatus } from '../types';

import { twMerge } from 'tailwind-merge';

interface HeaderProps {
    globalStatus: AlertStatus;
}

export function Header({ globalStatus }: HeaderProps) {
    const getStatusColor = (status: AlertStatus) => {
        switch (status) {
            case 'ok': return 'text-green-500 border-green-500 bg-green-500/10';
            case 'warning': return 'text-yellow-500 border-yellow-500 bg-yellow-500/10';
            case 'critical': return 'text-destructive border-destructive bg-destructive/10';
        }
    };

    const getStatusIcon = (status: AlertStatus) => {
        switch (status) {
            case 'ok': return <CheckCircle className="w-5 h-5" />;
            case 'warning': return <AlertTriangle className="w-5 h-5" />;
            case 'critical': return <AlertTriangle className="w-5 h-5" />;
        }
    };

    return (
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm px-6 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                    M
                </div>
                <div>
                    <h1 className="text-lg font-bold leading-none">MARS CONTROL</h1>
                    <span className="text-xs text-muted-foreground">OLYMPUS BASE</span>
                </div>
            </div>

            {/* Time */}
            <div className="flex gap-8">
                <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold">Earth (UTC)</div>
                        <div className="font-mono text-sm">12:45:30</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold">Mars (SOL)</div>
                        <div className="font-mono text-sm text-chart-4">SOL 452</div>
                    </div>
                </div>
            </div>

            {/* Status */}
            <div className={twMerge(
                "px-4 py-2 rounded-full border flex items-center gap-2 transition-colors",
                getStatusColor(globalStatus)
            )}>
                {getStatusIcon(globalStatus)}
                <span className="font-bold uppercase text-sm tracking-wider">
                    System {globalStatus}
                </span>
            </div>
        </header>
    );
}
