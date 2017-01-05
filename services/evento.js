module.exports = {
  format: eventos => {
    eventos.forEach(evento => {
      function addAditionalZero(value) {
        if (value < 10) {
          return `0${value}`;
        }

        return value;
      }

      function generateTimeAsString(time) {
        const day = addAditionalZero(time.getDate());
        const month = addAditionalZero(time.getMonth() + 1);
        const hours = addAditionalZero(time.getHours());
        const minutes = addAditionalZero(time.getMinutes());

        return `${day}/${month} às ${hours}:${minutes}`
      }

      const eventTime = evento.time;
      eventTime.setHours(eventTime.getHours() + 3);
      evento.timeAsString = generateTimeAsString(eventTime);

      const finishedTime = eventTime;
      finishedTime.setHours(eventTime.getHours() - 2);
      evento.finishedTime = generateTimeAsString(finishedTime);
    });

    return eventos;
  }
};
