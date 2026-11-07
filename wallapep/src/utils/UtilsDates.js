import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export const dateFormatTemplate = 'YYYY/MM/DD HH:mm';

export let timestampToString = (timestamp) => {
    const date = dayjs.unix(timestamp/1000);
    const formattedDate = date.format(dateFormatTemplate);
    return formattedDate;
}

export let timestampToDate = (timestamp) => {
    let dateInString = timestampToString(timestamp)
    return dayjs(dateInString, dateFormatTemplate)
}

export let timestampToTimeAgo = (timestamp) => {
    return dayjs(timestamp).fromNow();
}

export let disabledBirthdayDate = (current) => {
    return current && (current > dayjs().endOf("day") || current < dayjs().subtract(120, "year"));
}
