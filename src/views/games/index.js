var gameRoutes = [
  {
    componentPath: "views/games/asteroids/Game.vue",
    name: "Asteroids",
    slug: "asteroids",
    date: "05/10/19",
    controls: "Movement: a, w, s and d keys, Pause, Play and Restart: space key"
  },
  {
    componentPath: "views/games/cityRun/Game.vue",
    name: "City Run",
    slug: "city-run",
    date: "06/10/19",
    controls: "Movement: a, w, and d keys, Pause, Play and Restart: space key"
  }
];

if (process.env.NODE_ENV !== "production") {
  var exampleGame = {
    componentPath: "views/games/template/Game.vue",
    name: "Example",
    slug: "example",
    date: "06/10/19",
    controls: "none"
  };
  gameRoutes = [...gameRoutes, exampleGame];
}

export default gameRoutes;
