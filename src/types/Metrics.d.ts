export interface Metrics {
  monthEarnings: number;
  averageTicket: number;
  cancellationRate: number;
  retentionRate: number;
  mostFrequentServiceId: string;
  averageRating: number;
  appointmentsPerMonth: AppointmentsPerMonth[];
}

export interface AppointmentsPerMonth {
  month: string;
  appointments: number;
}
