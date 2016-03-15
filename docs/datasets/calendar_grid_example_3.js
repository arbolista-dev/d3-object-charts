var nowDate = new Date(),
  now = nowDate.getTime(),
  day = 3600 * 24 * 1000,
  one_year_ago = now - day * 365 * 1,
  cursor = one_year_ago,
  data2 = [];
while (cursor < now) {
  data2.push({
    date: new Date(cursor),
    value: 1000 * Math.random()
  });
  cursor += day;
}
