var mixin = {
  methods: {
    formatDate(dateStr) {
      if (dateStr) {
        let d = new Date(dateStr);
        return `${d.getFullYear().toString()}-${
          (d.getMonth() + 1).toString().length == 2
            ? (d.getMonth() + 1).toString()
            : `0${(d.getMonth() + 1).toString()}`
        }-${
          d.getDate().toString().length == 2
            ? d.getDate().toString()
            : `0${d.getDate().toString()}`
        }`;
      }
      return "";
    },
    formatDateLong: dateStr => {
      let d = new Date(dateStr);
      return `${d.getFullYear().toString()}-${
        (d.getMonth() + 1).toString().length == 2
          ? (d.getMonth() + 1).toString()
          : `0${(d.getMonth() + 1).toString()}`
      }-${
        d.getDate().toString().length == 2
          ? d.getDate().toString()
          : `0${d.getDate().toString()}`
      } ${
        d.getHours().toString().length == 2
          ? d.getHours().toString()
          : `0${d.getHours().toString()}`
      }:${
        d.getMinutes().toString().length == 2
          ? d.getMinutes().toString()
          : `0${d.getMinutes().toString()}`
      }:${
        d.getSeconds().toString().length == 2
          ? d.getSeconds().toString()
          : `0${d.getSeconds().toString()}`
      }`;
    },
    formatDateLong5Min: dateStr => {
      let d = new Date(dateStr);
      return `${d.getFullYear().toString()}-${
        (d.getMonth() + 1).toString().length == 2
          ? (d.getMonth() + 1).toString()
          : `0${(d.getMonth() + 1).toString()}`
      }-${
        d.getDate().toString().length == 2
          ? d.getDate().toString()
          : `0${d.getDate().toString()}`
      } ${
        d.getHours().toString().length == 2
          ? d.getHours().toString()
          : `0${d.getHours().toString()}`
      }:${
        (parseInt(d.getMinutes() / 5) * 5).toString().length == 2
          ? (parseInt(d.getMinutes() / 5) * 5).toString()
          : `0${(parseInt(d.getMinutes() / 5) * 5).toString()}`
      }:00`;
    }
  }
};

export default mixin;
