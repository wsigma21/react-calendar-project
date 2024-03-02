import { eachWeekOfInterval, endOfMonth, startOfMonth, eachDayOfInterval, endOfWeek, isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import { DateList, Schedule } from "../types/calendar";
import { getScheduleList } from "../api/calendar";

type PropsType = {
  currentDate: Date;
};

export const useCalendar = ({ currentDate }: PropsType) => {
  const [dateList, setDateList] = useState<DateList>([]);

  useEffect(() => {
    const monthOfSundayList = eachWeekOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    });
    const newDateList: DateList = monthOfSundayList.map((date) => {
      return eachDayOfInterval({
        start: date,
        end: endOfWeek(date),
      }).map((date) => ({ date, schedules: [] as Schedule[] }))
    })

    const scheduleList = getScheduleList()
    scheduleList.forEach((schedule) => {
      // スケジュールの日と一致する日を含む週を探す
      const firstIndex = newDateList.findIndex((oneWeek) =>
        oneWeek.some((item) => isSameDay(item.date, schedule.date))
      )
      if (firstIndex === -1) return;
      // 週の中で一致する日を探す
      const secondIndex = newDateList[firstIndex].findIndex((item) => 
        isSameDay(item.date, schedule.date)
      )
      newDateList[firstIndex][secondIndex].schedules = [
        ...newDateList[firstIndex][secondIndex].schedules,
        schedule,
      ]
    })

    setDateList(newDateList);
  }, [])

  return { dateList }
}
