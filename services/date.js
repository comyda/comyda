module.exports = {
  createFromString: (timeAsString) => {
    let [date, time] = timeAsString.split(' ');
    let [day, month, year] = date.split('/');
    let [hours, minutes] = time.split(':');

    month = parseInt(month) - 1;
    hours = parseInt(hours) - 3;

    return new Date(year, month, day, hours, minutes)
  }
}
