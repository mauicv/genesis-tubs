import Vue from "vue";
import Router from "vue-router";
import games from "./views/games/index.js";

Vue.use(Router);

var gamesRoutes = [];

games.forEach(function(game) {
  gamesRoutes.push({
    path: `/${game.slug}`,
    name: `/${game.name}`,
    component: () => import("./views/games/GameView.vue"),
    props: {
      game: () => import(`./${game.componentPath}`),
      name: game.name,
      controls: game.controls,
      prev: getPrev(game.name),
      next: getNext(game.name)
    }
  });
});

function getNext(name) {
  var currentGameIndex = games.findIndex(game => game.name == name);
  return games[(currentGameIndex + 1) % games.length].slug;
}

function getPrev(name) {
  var currentGameIndex = games.findIndex(game => game.name == name);
  if (currentGameIndex - 1 < 0) currentGameIndex = games.length;
  return games[currentGameIndex - 1].slug;
}

function getLatest() {
  return games[games.length - 1].slug;
}

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      redirect: `/${getLatest()}`
    },
    {
      path: "/about",
      name: "about",
      component: () => import("./views/About.vue")
    },
    {
      path: "/archive",
      name: "archive",
      component: () => import("./views/Archive.vue")
    },
    ...gamesRoutes
  ]
});
