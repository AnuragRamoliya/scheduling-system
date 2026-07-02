const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/;

export const normalizeTime = (time: string) => {
  const match = TIME_RE.exec(time);
  if (!match) {
    return time;
  }
  return `${match[1]}:${match[2]}:00`;
};

export const minutesFromTime = (time: string) => {
  const normalized = normalizeTime(time);
  const [hours, minutes] = normalized.split(":").map(Number);
  return hours * 60 + minutes;
};

export const timeFromMinutes = (total: number) => {
  const hours = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (total % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:00`;
};

export const isPastDate = (date: string) => {
  const today = new Date();
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString().slice(0, 10);
  return date < todayOnly;
};

export const rangesOverlap = (aStart: string, aEnd: string, bStart: string, bEnd: string) =>
  minutesFromTime(aStart) < minutesFromTime(bEnd) && minutesFromTime(bStart) < minutesFromTime(aEnd);
