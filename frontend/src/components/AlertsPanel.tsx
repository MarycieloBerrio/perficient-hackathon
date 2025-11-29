// Panel to display and manage active colony alerts
import { useState } from 'react';
import { clsx } from 'clsx';
import { AlertTriangle, X, CheckCircle, Info, Bell } from 'lucide-react';
import { useColony } from '../context/ColonyContext';
import type { ApiAlert } from '../types/backend';

interface AlertsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AlertsPanel({ isOpen, onClose }: AlertsPanelProps) {
  const { alerts, acknowledgeAlert, domes } = useColony();
  const [acknowledging, setAcknowledging] = useState<string | null>(null);

  const handleAcknowledge = async (alertId: string) => {
    try {
      setAcknowledging(alertId);
      await acknowledgeAlert(alertId, 'OPERATOR-001'); // TODO: use real operator
    } catch (err) {
      console.error('Error acknowledging alert:', err);
    } finally {
      setAcknowledging(null);
    }
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return <AlertTriangle className="w-5 h-5" />;
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getAlertStyles = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-950/50 border-red-700/50 text-red-400';
      case 'WARNING':
        return 'bg-amber-950/50 border-amber-700/50 text-amber-400';
      default:
        return 'bg-blue-950/50 border-blue-700/50 text-blue-400';
    }
  };

  const getDomeName = (domeId: string | null) => {
    if (!domeId) return 'Global System';
    const dome = domes.find(d => d.id === domeId);
    return dome?.name || domeId;
  };

  const activeAlerts = alerts.filter(a => a.is_active && !a.acknowledged);
  const acknowledgedAlerts = alerts.filter(a => a.is_active && a.acknowledged);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-mars-elevated border-l border-mars-border z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-mars-border flex items-center justify-between bg-mars-surface">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 text-primary">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Active Alerts</h2>
              <p className="text-sm text-gray-400">
                {activeAlerts.length} pending alert{activeAlerts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Active alerts */}
          {activeAlerts.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Requires Attention
              </h3>
              {activeAlerts.map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  domeName={getDomeName(alert.dome_id)}
                  onAcknowledge={handleAcknowledge}
                  isAcknowledging={acknowledging === alert.id}
                  getAlertIcon={getAlertIcon}
                  getAlertStyles={getAlertStyles}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                No active alerts
              </h3>
              <p className="text-sm text-gray-400">
                All systems are operating normally
              </p>
            </div>
          )}

          {/* Acknowledged alerts */}
          {acknowledgedAlerts.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-mars-border">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Acknowledged
              </h3>
              {acknowledgedAlerts.map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  domeName={getDomeName(alert.dome_id)}
                  onAcknowledge={handleAcknowledge}
                  isAcknowledging={false}
                  getAlertIcon={getAlertIcon}
                  getAlertStyles={getAlertStyles}
                  isAcknowledged
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

interface AlertCardProps {
  alert: ApiAlert;
  domeName: string;
  onAcknowledge: (alertId: string) => void;
  isAcknowledging: boolean;
  getAlertIcon: (level: string) => JSX.Element;
  getAlertStyles: (level: string) => string;
  isAcknowledged?: boolean;
}

function AlertCard({
  alert,
  domeName,
  onAcknowledge,
  isAcknowledging,
  getAlertIcon,
  getAlertStyles,
  isAcknowledged = false,
}: AlertCardProps) {
  const timeAgo = getTimeAgo(new Date(alert.created_at));

  return (
    <div
      className={clsx(
        'rounded-lg border p-4 transition-all',
        getAlertStyles(alert.level),
        isAcknowledged && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getAlertIcon(alert.level)}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {alert.level}
                </span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-400">{domeName}</span>
              </div>
              <p className="font-medium text-sm">{alert.message}</p>
            </div>
          </div>

          {/* Details */}
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
            <span>Code: {alert.code}</span>
            <span>•</span>
            <span>{timeAgo}</span>
          </div>

          {/* Actions */}
          {!isAcknowledged && (
            <button
              onClick={() => onAcknowledge(alert.id)}
              disabled={isAcknowledging}
              className={clsx(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                'bg-white/10 hover:bg-white/20 border border-white/20',
                isAcknowledging && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isAcknowledging ? 'Acknowledging...' : 'Acknowledge Alert'}
            </button>
          )}

          {isAcknowledged && alert.acknowledged_by && (
            <div className="text-xs text-gray-500">
              Acknowledged by {alert.acknowledged_by}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

