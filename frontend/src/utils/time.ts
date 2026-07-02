export const todayIso = () => new Date().toISOString().slice(0, 10);

export const timeLabel = (time: string) => time.slice(0, 5);

export const overlaps = (aStart: string, aEnd: string, bStart: string, bEnd: string) => aStart < bEnd && bStart < aEnd;
