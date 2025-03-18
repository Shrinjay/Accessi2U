import { formatDistanceToNow } from 'date-fns';
import { useGetReports } from '../hooks/useGetReports.js';

function ReportsSummary({ roomId }: { roomId: number }) {
    const { reports, isLoadingReports } = useGetReports(roomId);
  
    if (isLoadingReports) {
      return <div>Loading...</div>;
    }
  
    if (!reports || reports.length === 0) {
      return <div>No reports</div>;
    }
  
    const reportTypeMap = reports.reduce((acc, report) => {
      if (report.reportType) {
        if (!acc[report.reportType]) {
          acc[report.reportType] = {
            count: 1,
            latest: new Date(report.updated_at || report.created_at || ''),
          };
        } else {
          acc[report.reportType].count += 1;
          const currentDate = new Date(report.updated_at || report.created_at || '');
          if (currentDate > acc[report.reportType].latest) {
            acc[report.reportType].latest = currentDate;
          }
        }
      }
      return acc;
    }, {} as Record<string, { count: number; latest: Date }>);
  
    return (
      <div>
        {Object.entries(reportTypeMap).map(([type, { count, latest }]) => (
          <div key={type}>
            <strong>{type}</strong>: {count} report{count > 1 ? 's' : ''}, last reported{' '}
            {formatDistanceToNow(latest, { addSuffix: true })}
          </div>
        ))}
      </div>
    );
  }
  