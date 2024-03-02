import { eachWeekOfInterval, endOfMonth, getMonth, startOfMonth, eachDayOfInterval, endOfWeek, isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import { CalendarHeader } from "../organisms/CalendarHeader";
import { CalendarBody } from "../organisms/CalendarBody";
import { DateList, Schedule } from "../../types/calendar";
import { getScheduleList } from "../../api/calendar";

export const CalendarPage = () => {
  const today = new Date()
  const [dateList, setDateList] = useState<DateList>([]);

  useEffect(() => {
    const monthOfSundayList = eachWeekOfInterval({
      start: startOfMonth(today),
      end: endOfMonth(today),
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



  return (
    <>
      <h1 className="font-bold text-3xl mb-5">{`${(getMonth(today)) + 1}月`}</h1>
      <table className="w-[80%] border-collapse border-2 border-solid border-lime-800 table-fixed">
        <CalendarHeader />
        <CalendarBody currentDate={today} dateList={dateList}/>
      </table>
    </>
  )
}
