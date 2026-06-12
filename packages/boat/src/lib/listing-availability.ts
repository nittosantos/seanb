export type BookedDateRange = {
  checkIn: string;
  checkOut: string;
};

export function parseBookedRanges(
  ranges: BookedDateRange[],
): { checkIn: Date; checkOut: Date }[] {
  return ranges.map((range) => ({
    checkIn: new Date(range.checkIn),
    checkOut: new Date(range.checkOut),
  }));
}

function startOfDay(date: Date): Date {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

export function isDateBooked(
  date: Date,
  ranges: { checkIn: Date; checkOut: Date }[],
): boolean {
  const day = startOfDay(date).getTime();

  return ranges.some((range) => {
    const checkIn = startOfDay(range.checkIn).getTime();
    const checkOut = startOfDay(range.checkOut).getTime();
    return day >= checkIn && day < checkOut;
  });
}

export function isRangeAvailable(
  checkIn: Date,
  checkOut: Date,
  ranges: { checkIn: Date; checkOut: Date }[],
): boolean {
  const start = startOfDay(checkIn);
  const end = startOfDay(checkOut);

  if (start >= end) {
    return false;
  }

  return !ranges.some((range) => {
    const bookedStart = startOfDay(range.checkIn);
    const bookedEnd = startOfDay(range.checkOut);
    return start < bookedEnd && end > bookedStart;
  });
}

export function filterAvailableDate(
  date: Date,
  ranges: { checkIn: Date; checkOut: Date }[],
): boolean {
  const today = startOfDay(new Date());

  if (startOfDay(date) < today) {
    return false;
  }

  return !isDateBooked(date, ranges);
}
