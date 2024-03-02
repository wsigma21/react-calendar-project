import { getDate } from "date-fns";
import { dateColor } from "../../libs/date";


type PropsType = {
  currentDate: Date
  dateList: Date[][]
}

export const CalendarBody = ({ currentDate, dateList }: PropsType) => {
  return (
    <tbody>
      {dateList.map((oneWeek) => (
        <tr key={`week-${getDate(oneWeek[0])}`} className="mx-10">
          {oneWeek.map((oneDate) => (
            <td
              key={`day-${getDate(oneDate)}`}
              className="bg-white h-[10vh] border-2 border-solid border-lime-800"
            >
              <span
                className={`inline-block w-[20px] leading-[20px] text-center ${dateColor(
                  oneDate, 
                  currentDate
                )}`}
              >
                {getDate(oneDate)}
              </span>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}
