import { Report } from 'database';
import { trpc } from '../trpc';

export type ReportViewModel = Partial<
  Omit<Report, 'created_at' | 'updated_at'> & {
    created_at: string;
    updated_at: string;
  }
>;

export const useGetReports = (roomId: number) => {
  const { data: reports, isLoading: isLoadingReports } = trpc.listReports.useQuery(
    { roomId },
  );

  return {
    reports,
    isLoadingReports,
  };
};
