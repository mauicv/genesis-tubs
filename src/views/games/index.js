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
  },
  {
    componentPath: "views/games/particles/Game.vue",
    name: "Particles",
    slug: "particles",
    date: "06/10/19",
    controls: "Obligatory particle simulation"
  },
  {
    componentPath: "views/games/wormRace/Game.vue",
    name: "Worm Racer",
    slug: "worm-racer",
    date: "06/10/19",
    controls:
      "left and right arrow keys to move top worm (worm2). a and d to move bottom worm. (worm1)"
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
