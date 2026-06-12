import { useEffect, useState } from 'react';
import { isDateBooked } from '@/lib/listing-availability';
import { getDaysInMonth } from '@/components/listing-details/calendar/get-days';
import {
  MonthDataTypes,
  MonthPropsTypes,
} from '@/components/listing-details/calendar/calendar-types';

export default function Months({
  dates,
  bookedRanges = [],
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
  monthContainerClassName,
  weekNameClassName = 'mt-8 grid grid-cols-7 gap-0 text-center text-sm font-semibold text-gray-dark md:text-base',
}: MonthPropsTypes) {
  const [changeMonth, setChangeMonth] = useState({
    showMonth: month,
    showYear: year,
  });

  const [printDate, setPrintDate] = useState<MonthDataTypes>();

  useEffect(() => {
    setChangeMonth({
      showMonth: month,
      showYear: year,
    });
  }, [month, year]);

  const checkIn = dates?.checkin;
  const checkOut = dates?.checkout;

  useEffect(() => {
    const { currentMonth, currentData } = getDaysInMonth(
      changeMonth.showMonth,
      changeMonth.showYear,
    );

    const newCurrentData = currentData?.map((item) => {
      const day = item.time;

      if (!day) {
        return { ...item, className: '' };
      }

      if (bookedRanges.length > 0 && isDateBooked(day, bookedRanges)) {
        return { ...item, className: 'between-range' };
      }

      if (
        checkIn?.getDate() === day.getDate() &&
        checkIn?.getMonth() === day.getMonth() &&
        checkIn?.getFullYear() === day.getFullYear()
      ) {
        return { ...item, className: 'calender-start-range' };
      }

      if (
        checkOut?.getDate() === day.getDate() &&
        checkOut?.getMonth() === day.getMonth() &&
        checkOut?.getFullYear() === day.getFullYear()
      ) {
        return { ...item, className: 'calender-end-range' };
      }

      if (checkIn && checkOut && checkIn < day && checkOut > day) {
        return { ...item, className: 'between-range' };
      }

      return { ...item, className: '' };
    });

    setPrintDate({
      currentMonth,
      currentData: newCurrentData,
    });
  }, [dates, bookedRanges, changeMonth, checkIn, checkOut]);

  return (
    <div className={monthContainerClassName}>
      <h3 className="text-center text-base font-bold capitalize text-gray-dark xl:text-xl">
        <span>{printDate?.currentMonth}</span>
        <span className="ml-3">{changeMonth.showYear}</span>
      </h3>
      <div className={weekNameClassName}>
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-y-1 text-center xl:gap-y-3">
        {printDate?.currentData?.map((item, index) => (
          <div key={`${item?.date}-${item?.day}-${index}`}>
            <div
              className={`p-[12px] text-sm font-normal text-gray-dark md:text-base ${item.className}`}
            >
              {item.date && item.date < 10 ? (
                <span>0{item.date}</span>
              ) : (
                <span>{item.date}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
