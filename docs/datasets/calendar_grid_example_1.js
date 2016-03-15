var nowDate = new Date(),
  now = nowDate.getTime(),
  day = 3600 * 24 * 1000,
  one_year_ago = now - day * 365 * 1,
  cursor = one_year_ago,
  data1 = [],
while (cursor < now) {
  data.push({
    day_date: new Date(cursor),
    production: 100 * Math.random()
  });
  cursor += day;
}
