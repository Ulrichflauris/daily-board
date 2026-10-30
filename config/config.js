/* Configuration de daily-board — aucune donnee sensible ici */
var YCOS_CONFIG = {
  user: {
    name: "YESSIA",
    city: "Rennes",
    lat: 48.1173,
    lon: -1.6778,
    tz: "Europe/Paris"
  },
  weather: {
    enabled: true,
    provider: "open-meteo",
    cacheMinutes: 30
  },
  geo: {
    enabled: true,
    maxAgeHours: 12
  },
  tasks: {
    provider: "local",
    staleDays: 3
  },
  focus: {
    minutes: 25,
    breakMinutes: 5
  },
  news: {
    enabled: true,
    provider: "hacker-news",
    cacheMinutes: 30,
    count: 6
  },
  windows: {
    persist: true
  }
};
