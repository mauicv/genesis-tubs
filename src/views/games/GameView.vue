<template>
  <b-container class="bv-example-row">
    <b-row>
      <b-col></b-col>
      <b-col cols="8">
        <div class="title">
          <img
            alt="genesis-tubs logo"
            src="../../assets/genesis-tub.png"
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
            <a href="https://ko-fi.com/genesistubs" class="button1">Fund Me</a>
          </div>
        </div>
      </b-col>
      <b-col></b-col>
    </b-row>
    <b-row>
      <b-col></b-col>
      <b-col>
        <div>
          <div>
            <router-link class="game-link" :to="`/${prev}`">
              &#8880;&#8759;prev
            </router-link>

            &equiv;&#8527;&equiv;

            <router-link class="game-link" :to="`/${next}`">
              next&#8759;&#8881;
            </router-link>
          </div>
        </div>
      </b-col>
      <b-col></b-col>
    </b-row>
    <b-row>
      <div class="game-title">
        {{ name }}
      </div>
    </b-row>
    <component :is="game" />
  </b-container>
</template>

<script>
export default {
  name: "game-view",
  props: ["name", "game", "prev", "next"]
};
</script>

<style>
.game-title {
  margin: auto;
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
}

.game-link {
  margin: 10px;
  font-size: 12px;
}
</style>
