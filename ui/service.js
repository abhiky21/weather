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

  const formHour = time.toLocaleTimeString("en-HI");

  const final_hour =
    parseInt(formHour.split(":")[0]) + " " + formHour.split(" ")[1];

  return {
    uit: final_hour,
    ckt: hour,
  };
}

// if (items.sys.pod == "n") {
//   console.log(
//     typeof items.sys.pod + " n" + " " + timeFormate(items.dt_txt).uit,
//   );

// document.body.style.backgroundImage = "url('assets/weather_neight.png')";
// selectCity.style.color = "white";
// } else if (items.sys.pod == "d") {
//   console.log(items.sys.pod + " d" + " " + timeFormate(items.dt_txt).uit);
//   document.body.style.backgroundImage = "url('assets/weather_morning.png')";
//   selectCity.style.color = "black";
// } else {
//   console.log(items.sys.pod + " " + timeFormate(items.dt_txt).uit);
//   document.body.style.backgroundImage = "url('assets/weather-bcImage.png')";
//   selectCity.style.color = "black";
// }

export { timeClear, dateModify, weekdays, timeFormate };
