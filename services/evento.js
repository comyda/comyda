module.exports = {
  format: eventos => {
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

    function getStatus(time) {
      const value = time.getTime() - Date.now();
      if (value < 0) return "PEDIDO ENCERRADO";
      return "";
    }

    function sortEvents(evento1, evento2) {
      if (evento1.time < evento2.time) return -1;
      if (evento1.time > evento2.time) return 1;
      return 0;
    }

    eventos.forEach(evento => {
      const eventTime = evento.time;
      eventTime.setHours(eventTime.getHours() + 3);
      evento.timeAsString = generateTimeAsString(eventTime);

      const finishedTime = eventTime;
      finishedTime.setHours(eventTime.getHours() - 2);
      evento.finishedTime = generateTimeAsString(finishedTime);

      evento.status = getStatus(evento.time);
    });

    let nonFinishedEvents = eventos.filter(evento => evento.status === "");
    let finishedEvents = eventos.filter(evento => evento.status === "PEDIDO ENCERRADO");

    nonFinishedEvents.sort(sortEvents);
    finishedEvents.sort(sortEvents);

     const quartEvent = nonFinishedEvents.concat(finishedEvents).slice(0,4);
     return quartEvent;
  }
};
