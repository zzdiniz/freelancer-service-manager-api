const parseToDatetime = (receivedDateTime: string) => {
    const [date,time] = receivedDateTime.split(' ')
    const [day,month,year] = date.split('/').map(Number)
    const [hour,minute] = time.split(':').map(Number)

    const newDate = new Date(year,month -1, day, hour, minute)

    if (isNaN(newDate.getTime())) {
        throw new Error('Invalid date format');
    }

    const parsedDateTime = newDate.toISOString().slice(0, 19).replace('T', ' ');

    return parsedDateTime;
}

export default parseToDatetime