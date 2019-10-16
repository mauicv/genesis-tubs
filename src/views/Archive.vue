<template>
  <div>
    <div class="topBar">
      <b-container class="bv-example-row">
        <b-row>
          <b-col></b-col>
          <b-col cols="8">
            <div class="title">
              <img
                alt="genesis-tubs logo"
                src="../assets/genesis-tub.png"
                height="80px"
                width="80px"
              />
              <span style="margin-left:20px;">Genesis Tubs</span>
            </div>
          </b-col>
          <b-col></b-col>
        </b-row>
        <b-row>
          <b-col></b-col>
          <b-col>
            <div id="nav">
              <div class="nav1">
                <router-link class="button1" to="/about">About</router-link>
                <router-link class="button1" to="/archive">Archive</router-link>
                <a href="https://ko-fi.com/genesistubs" class="button1"
                  >Fund Me</a
                >
              </div>
            </div>
          </b-col>
          <b-col></b-col>
        </b-row>
        <b-row>
          <b-col></b-col>
          <b-col cols="2">
            <div v-for="(item, index) in index" v-bind:key="index">
              <span class="index-num">{{ index + 1 }}</span>
              <a class="game-link" :href="`./${item.route}`">
                {{ item.title }}
              </a>
            </div>
          </b-col>
          <b-col></b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import gamesIndex from "./games/index.js";

export default {
  name: "archive",
  data: function() {
    return {
      index: gamesIndex.map(item => {
        return {
          title: item.name,
          route: item.slug
        };
      })
    };
  },
  components: {}
};
</script>

<style scoped>
.game-link {
  text-align: center;
  font-size: 14px;
  width: 70%;
  margin: auto;
  padding: 5px;
  color: black;
}

.index-num {
  float: left;
  font-size: 14px;
  color: pink;
}
</style>
