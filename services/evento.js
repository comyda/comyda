module.exports = {
  format: docs => {
    docs.forEach(doc => {
      function addAditionalZero(value) {
        if (value < 10) {
          return `0${value}`;
          return '0' + value;
        }

        return value;
      }

      let day = addAditionalZero(doc.time.getDate());
      let month = addAditionalZero(doc.time.getMonth() + 1);
      let hours = addAditionalZero(doc.time.getHours() + 3);
      let minutes = addAditionalZero(doc.time.getMinutes());

      doc.timeAsString = `${day}/${month} às ${hours}:${minutes}`;
    });

    return docs;
  }
};
