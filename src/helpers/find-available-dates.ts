import moment from "moment-timezone";
import AppointmentInterface from "../types/AppointmentInterface";

const findAvailableDates = (
  occupiedDates: AppointmentInterface[]|null,
  startDate: string,
  endDate: string
): string[] => {
  const timezone = "America/Sao_Paulo";
  const start = moment.tz(startDate, timezone);
  const end = moment.tz(endDate, timezone);

  const generateAllDates = (
    current: moment.Moment,
    dates: string[] = []
  ): string[] => {
    return current.isAfter(end)
      ? dates
      : generateAllDates(current.clone().add(1, "hour"), [
          ...dates,
          current.format("YYYY-MM-DD HH:mm:ss"),
        ]);
  };

  const allDates = generateAllDates(start);

  return allDates.filter((date) => {
    const momentDate = moment.tz(date, timezone);
    const isWeekend = momentDate.day() === 0 || momentDate.day() === 6;
    const isOutsideBusinessHours = momentDate.hour() < 9 || momentDate.hour() >= 18;

    if (isWeekend || isOutsideBusinessHours) {
      return false;
    }

    return !occupiedDates?.some((appointment) => {
      const appointmentDate = moment.tz(appointment.datetime, timezone).format("YYYY-MM-DD HH:mm:ss");
      return date === appointmentDate;
    });
  });
}

export default findAvailableDates;
