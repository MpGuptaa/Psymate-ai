const convertTimeToNum = time => {
  const hours = parseInt(time.split(':')[0]) * 60;
  const minutes = parseInt(time.split(':')[1]);
  return hours + minutes;
};
const options = {timeStyle: 'short'};

export function getDate(dayString) {
  const today = new Date();
  const year = today.getFullYear().toString();
  let month = (today.getMonth() + 1).toString();

  if (month.length === 1) {
    month = "0" + month;
  }

  return dayString.replace("YEAR", year).replace("MONTH", month);
}

export function getMonth(monthStr) {
  return new Date(monthStr + "-1-01").getMonth() + 1;
}
export const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
export const generateDates = days => {
  const currentDate = new Date();
  const dates = [];
  for (let i = 0; i <= days; i++) {
    const newDate = new Date();
    newDate.setDate(currentDate.getDate() + i);
    dates.push({
      id: i,
      dateFull: newDate,
      date:
        newDate.toString().split(' ')[1] +
        ' ' +
        newDate.toString().split(' ')[2],
      dayDisplay: days[newDate.getDay()],
      day: newDate.toString().split(' ')[0],
      slots: [],
    });
  }
  return dates;
};
export const getDateInFormat = passedDate => {
  const date = new Date(passedDate);
  var returnDate;
  const month = date.getMonth() + 1;
  if (month > 9) {
    if (date.getDate() > 9) {
      returnDate = date.getFullYear() + '-' + month + '-' + date.getDate();
    } else {
      returnDate = date.getFullYear() + '-' + month + '-0' + date.getDate();
    }
  } else {
    if (date.getDate() > 9) {
      returnDate = date.getFullYear() + '-0' + month + '-' + date.getDate();
    } else {
      returnDate = date.getFullYear() + '-0' + month + '-0' + date.getDate();
    }
  }
  return returnDate;
};
function getMonthIndex(month) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return months.indexOf(month);
}
const checkAppointmentExist = (relevantAppointments, cardTime, duration) => {
  const startTimeFirst = convertTimeToNum(cardTime);
  const endTimeFirst = convertTimeToNum(cardTime) + duration;
  for (let k = 0; k < relevantAppointments.length; k++) {
    const startTimeSecond = convertTimeToNum(
      relevantAppointments[k].slot.split(' ')[0],
    );
    let endTimeSecond;
    if (relevantAppointments.duration) {
      endTimeSecond =
        convertTimeToNum(relevantAppointments[k].slot.split(' ')[0]) +
        parseInt(relevantAppointments.duration);
    } else {
      endTimeSecond =
        convertTimeToNum(relevantAppointments[k].slot.split(' ')[0]) + duration;
    }
    // console.log(convertTimeToNum(relevantAppointments[k].slot.split(" ")[0]) + duration);
    const maxTime = Math.max(startTimeFirst, startTimeSecond);
    const dateTimeString = `${relevantAppointments[k].slot} ${relevantAppointments[k].appointmentDate}`;
    const dateTimeParts = dateTimeString.split(' ');
    const timeParts = dateTimeParts[0].split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const month = dateTimeParts[2];
    const day = parseInt(dateTimeParts[3], 10);
    const year = parseInt(dateTimeParts[4], 10);
    const startTimePayload = new Date(
      year,
      getMonthIndex(month),
      day,
      hours,
      minutes,
    );
    if (maxTime === startTimeFirst) {
      if (startTimeFirst < endTimeSecond) {
        return {
          ...relevantAppointments[k],
          startTime: new Date(startTimePayload),
          showStartTime: new Date(startTimePayload).toLocaleTimeString(
            'en-IN',
            options,
          ),
        };
      }
    } else {
      if (startTimeSecond < endTimeFirst) {
        return {
          ...relevantAppointments[k],
          startTime: new Date(startTimePayload),
          showStartTime: new Date(startTimePayload).toLocaleTimeString(
            'en-IN',
            options,
          ),
        };
      }
    }
  }
  return false;
};
export function getShortestDuration(items) {
  let shortestDuration = Infinity;
  for (let i = 0; i < items?.length; i++) {
    const itemDuration = parseInt(items[i]?.value?.duration);
    if (itemDuration < shortestDuration) {
      shortestDuration = itemDuration;
    }
  }
  return shortestDuration;
}
export const buildSlots = (
  appointments = [],
  sessions = [],
  day,
  passedDate,
  category,
) => {
  const returnCards = [];
  let relevantAppointments;

  const date = getDateInFormat(passedDate);
  if (appointments) {
    const currentDate = new Date(date);
    relevantAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);

      return (
        appointmentDate.toLocaleDateString() == currentDate.toLocaleDateString()
      );
    });
  } else {
    relevantAppointments = [];
  }
  sessions.forEach(session => {
    for (let i = 0; i < 7; i++) {
      if (session.days[i].checked && session.days[i].day === day) {
        const startTime =
          new Date(session.startTiming).getHours() * 60 +
          new Date(session.startTiming).getMinutes();
        const endTime =
          new Date(session.endTiming).getHours() * 60 +
          new Date(session.endTiming).getMinutes();
        const divisions = (endTime - startTime) / category;
        for (let j = 0; j < divisions; j++) {
          const startTimeBench = new Date(session.startTiming);
          const startTimePayload = new Date(
            startTimeBench.getTime() + category * j * 60000,
          );
          const endTimePayload = new Date(
            startTimeBench.getTime() + category * (j + 1) * 60000,
          );

          let cardTime;
          if (startTimePayload.getMinutes() < 10) {
            if (startTimePayload.getHours() < 10) {
              cardTime = `0${startTimePayload.getHours()}:0${startTimePayload.getMinutes()}`;
            } else {
              cardTime = `${startTimePayload.getHours()}:0${startTimePayload.getMinutes()}`;
            }
          } else {
            if (startTimePayload.getHours() < 10) {
              cardTime = `0${startTimePayload.getHours()}:${startTimePayload.getMinutes()}`;
            } else {
              cardTime = `${startTimePayload.getHours()}:${startTimePayload.getMinutes()}`;
            }
          }
          if (
            checkAppointmentExist(
              relevantAppointments,
              cardTime,
              parseInt(category),
            )
          ) {
            continue;
          }
          const payload = {
            startTime: startTimePayload,
            endTime: endTimePayload,
            showStartTime: startTimePayload.toLocaleTimeString(
              'en-IN',
              options,
            ),
            showEndTime: endTimePayload.toLocaleTimeString('en-IN', options),
            status: checkAppointmentExist(relevantAppointments, cardTime),
            duration: session.duration,
            category: session.category,
          };
          returnCards.push({...payload});
        }
      }
    }
  });
  returnCards.sort((timing1, timing2) => {
    const startTime1 =
      new Date(timing1.startTime).getHours() * 60 +
      new Date(timing1.startTime).getMinutes();
    const startTime2 =
      new Date(timing2.endTime).getHours() * 60 +
      new Date(timing2.endTime).getMinutes();
    return startTime1 - startTime2;
  });
  return returnCards;
};
