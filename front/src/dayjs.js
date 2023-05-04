import relativeTime from "dayjs/plugin/relativeTime";
import UpdateLocale from "dayjs/plugin/updateLocale";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
dayjs.extend(relativeTime);
dayjs.extend(UpdateLocale);
dayjs.updateLocale("fr", {
  relativeTime: {
    future: "dans %s",
    past: "il y a %s",
    s: "1min",
    m: "1min",
    mm: "%dmin",
    h: "1h",
    hh: "%dh",
    d: "1j",
    dd: "%d jrs",
    M: "1 mois",
    MM: "%d mois",
    y: "1 an",
    yy: "%d ans",
  },
});

export default dayjs;
