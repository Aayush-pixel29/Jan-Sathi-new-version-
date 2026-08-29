import { StatusEntry, GrievanceStatus } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Circle, CheckCircle2, Clock, CircleDot } from 'lucide-react';

const ALL_STATUSES: GrievanceStatus[] = ['Filed', 'Forwarded', 'Under Review', 'Action Taken', 'Closed'];

interface StatusTimelineProps {
  statusHistory: StatusEntry[];
  currentStatus: GrievanceStatus;
  translations?: Record<string, { explanation: string; next_steps: string }>;
}

export default function StatusTimeline({ statusHistory, currentStatus, translations }: StatusTimelineProps) {
  const currentIndex = ALL_STATUSES.indexOf(currentStatus);

  return (
    <div className="space-y-0">
      {ALL_STATUSES.map((status, index) => {
        const historyEntry = statusHistory.find((h) => h.status === status);
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;

        return (
          <div key={status} className="flex gap-3">
            {/* Vertical line + icon */}
            <div className="flex flex-col items-center">
              {isCompleted && (
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
              )}
              {isCurrent && (
                <CircleDot className="w-6 h-6 text-blue-600 shrink-0 animate-pulse" />
              )}
              {isPending && (
                <Circle className="w-6 h-6 text-gray-500 shrink-0" />
              )}
              {index < ALL_STATUSES.length - 1 && (
                <div
                  className={`w-0.5 h-full min-h-[2rem] ${
                    isCompleted ? 'bg-emerald-500' : isCurrent ? 'bg-blue-300' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>

            {/* Content */}
            <div className={`pb-6 ${isPending ? 'opacity-40' : ''}`}>
              <p className={`font-semibold text-sm ${
                isCurrent ? 'text-blue-700' : isCompleted ? 'text-emerald-700' : 'text-gray-500'
              }`}>
                {status}
              </p>
              {historyEntry && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatDate(historyEntry.timestamp)}
                </p>
              )}
              {translations && translations[status] && (isCurrent || isCompleted) && (
                <div className="mt-1.5 bg-blue-50 rounded-lg p-3 text-sm text-gray-700 border border-blue-100">
                  <p>{translations[status].explanation}</p>
                  {isCurrent && translations[status].next_steps && (
                    <p className="mt-1 text-blue-700 font-medium text-xs">
                      → {translations[status].next_steps}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
