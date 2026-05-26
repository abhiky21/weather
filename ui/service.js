function timeClear(time) {
  return new Date(time * 1000).toLocaleTimeString();
}

function dateModify(dt) {
  const [date] = dt.split(" ");
  return date;
}

function weekdays(dt) {
  const date = new Date(dt);
  const today = new Date();
  // 2026-05-26
  if (date.toDateString() == today.toDateString()) {
    return "Today";
  }

  const option = {
    day: "2-digit",
    weekday: "short",
  };

  return date.toLocaleDateString("en-GB", option);
}

function timeFormate(ti) {
  const time = new Date(ti);
  const hour = time.getHours();

  const ho = time.toLocaleTimeString("en-HI");

  const h = parseInt(ho.split(":")[0]) + " " + ho.split(" ")[1] + "-" + hour;

  return h;
}

export { timeClear, dateModify, weekdays, timeFormate };
