<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: grey;
  background-color: white;
}

#nav {
  padding: 15px;
}

#nav a.router-link-exact-active {
  color: grey;
  background-color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
}

#nav a {
  color: grey;
  /* background-color: rgba(255, 255, 255, 0.6); */
  background-color: pink;
  color: black;
  text-decoration: none;
}

body,
html {
  height: 100%;
  width: 100%;
  margin: 0px;
  padding: 0px;
  font-family: Verdana;
  font-size: 10px;
  /* background-image: url(background.png); */
  overflow-y: scroll;
}

canvas {
  height: 80%;
  width: 100%;
  border: solid;
  border-radius: 10px;
}

div,
header {
  margin: 0px;
  padding: 0px;
}

.controls {
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.6);
  font-size: 15px;
  font-weight: bold;
}

.title {
  background-color: rgba(255, 255, 255, 0.6);
  font-size: 50px;
  color: black;
  margin-top: 20px;
}

.button1 {
  margin: 5px;
  padding-right: 5px;
  padding-left: 5px;
  border-radius: 5px;
  border: solid;
  border-width: 1px;
}

#music {
  opacity: 0.3;
}

.nav1 {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}

.nav2 {
  padding: 5px;
}

.allContent {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  align-items: center;
}

a:link,
a:visited {
  background-color: rgba(255, 255, 255, 0.6);
  color: grey;
  text-decoration: none;
}

a:hover,
a:active {
  opacity: 0.3;
}

.archiveList {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}

.archiveElement {
  padding-top: 15px;
  font-size: 15px;
  background-color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
}

.textPost {
  width: 50%;
  border: solid;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 25px;
  font-size: 20px;
}
</style>
