import moment from "moment";

export const activityDateFormat = (date: string | Date) => {
  const duration = moment.duration(moment().diff(moment(date)));
  const seconds = duration.asSeconds();

  if (seconds < 60) return `${Math.floor(seconds)}s`; // seconds
  if (seconds < 3600) return `${Math.floor(duration.asMinutes())}m`; // minutes
  if (seconds < 86400) return `${Math.floor(duration.asHours())}h`; // hours
  return `${Math.floor(duration.asDays())}d`; // days
};
