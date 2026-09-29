// What's going on outside the window: Toronto's real weather, plus decorations
// by date. Plain JS (no three, no React) so the tests can import it.

// Open-Meteo current weather for Toronto; no API key needed.
export const WEATHER_URL = "https://api.open-meteo.com/v1/forecast?latitude=43.65&longitude=-79.38&current=weather_code";

// WMO weather code (what Open-Meteo returns) -> what falls past the window.
export function weatherKind(code) {
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if (code >= 95) return "storm";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  return "clear";
}

// ponytail: festival dates follow lunar calendars, so they're a hand-kept table
// (±3 days covers moon-sighting differences); extend it past 2030.
const DIWALI = ["2026-11-08", "2027-10-29", "2028-10-17", "2029-11-05", "2030-10-26"];
const EID = [
  "2027-03-10", "2027-05-17", "2028-02-27", "2028-05-05",
  "2029-02-15", "2029-04-24", "2030-02-05", "2030-04-13",
];
const near = (date, days, list) => list.some((d) => Math.abs(date - new Date(`${d}T12:00:00`)) <= days * 864e5);

export function decorations(date) {
  const m = date.getMonth();
  const d = date.getDate();
  return {
    lights: m === 11 || (m === 0 && d <= 6), // December through the first week of January
    diyas: near(date, 3, DIWALI),
    lantern: near(date, 3, EID),
    pumpkin: m === 9 && d >= 24, // the last week of October
  };
}
