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
  tasks: {
    provider: "local"
  },
  news: {
    enabled: false,
    items: []
  },
  windows: {
    persist: true
  }
};
