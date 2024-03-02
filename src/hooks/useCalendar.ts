import { eachWeekOfInterval, endOfMonth, startOfMonth, eachDayOfInterval, endOfWeek, isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import { DateList, Schedule } from "../types/calendar";
import { getScheduleList } from "../api/calendar";

type PropsType = {
  currentDate: Date;
};

export const useCalendar = ({ currentDate }: PropsType) => {
  const [dateList, setDateList] = useState<DateList>([]);

  const getDateListIndex = (
    currentDateList: DateList,
    schedule: Schedule
  ): number[] => {
    // スケジュールの日と一致する日を含む週を探す
    const firstIndex = currentDateList.findIndex((oneWeek) => {
      return oneWeek.some((item) => isSameDay(item.date, schedule.date))
    })
    if (firstIndex === -1) return[-1, -1];
    // 週の中で一致する日を探す
    const secondIndex = currentDateList[firstIndex].findIndex((item) => {
      return isSameDay(item.date, schedule.date)
   });
   return [firstIndex, secondIndex];
  }

  const addSchedule = (schedule: Schedule) => {
    const newDateList = [...dateList]

    const [firstIndex, secondIndex] = getDateListIndex(newDateList, schedule);
    if (firstIndex === -1) return;
    
    newDateList[firstIndex][secondIndex].schedules = [
      ...newDateList[firstIndex][secondIndex].schedules,
      schedule,
    ]
    setDateList(newDateList)
  }

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
      const [firstIndex, secondIndex] = getDateListIndex(newDateList, schedule);
      if (firstIndex === -1) return;

      newDateList[firstIndex][secondIndex].schedules = [
        ...newDateList[firstIndex][secondIndex].schedules,
        schedule,
      ]
    })

    setDateList(newDateList);
  }, [currentDate])

  return { 
    dateList,
    addSchedule,
  }
}
