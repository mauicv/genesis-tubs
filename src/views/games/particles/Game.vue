<template>
  <canvas id="Canvas" />
</template>

<script>
import builder from "./js/build.js";
import drawer from "./js/draw.js";

export default {
  name: "asteroids",
  data: function() {
    return {
      canvas: null,
      canvasTop: null,
      canvasLeft: null,
      drawCtx: null,
      controller: null,
      running: false,
      finished: false
    };
  },
  mounted() {
    this.setupCanvas();
    var enviro = this.loadEnviroment();
    this.draw(enviro);
    this.createAndstart(enviro);
  },
  methods: {
    setupCanvas() {
      var canvas = document.getElementById("Canvas");
      var WIDTH = document.documentElement.clientWidth;
      var HEIGHT = document.documentElement.clientHeight;
      canvas.width = WIDTH;
      canvas.height = HEIGHT;
      var drawCtx = canvas.getContext("2d");
      var rect = canvas.getBoundingClientRect();
      this.canvas = canvas;
      this.drawCtx = drawCtx;
      this.canvasTop = rect.top;
      this.canvasLeft = rect.left;
    },
    loadEnviroment: function() {
      return builder.createEnvironment(this);
    },
    // input methods
    handleMouseMove(event) {
      var x = this.getCanvasLoc(event);  // eslint-disable-line
    },
    handleMouseClick(event) {
      var x = this.getCanvasLoc(event); // eslint-disable-line
    },
    getCanvasLoc(event) {
      return {
        x: [event.clientX - this.canvasLeft, event.clientY - this.canvasTop]
      };
    },
    onkeydown(event) {
      if (!this.finished) {
        event.keyCode == 32 && this.running ? this.stop() : this.start();
      } else {
        if (event.keyCode == 32) {
          this.restart();
          this.finished = false;
        }
      }
    },
    // game state methods
    createAndstart(enviro) {
      this.controller = this.createRunner(enviro);
      this.controller.run();
      this.running = true;
      document.addEventListener("keydown", this.onkeydown, false);
      document.addEventListener("keyup", this.onkeyup, false);
    },
    restart() {
      if (this.controller) this.controller.destroy();
      var enviro = this.loadEnviroment();
      this.controller = this.createRunner(enviro);
      this.controller.run();
      this.running = true;
    },
    stop() {
      if (this.controller) this.controller.stop();
      this.running = false;
    },
    start() {
      if (this.controller && !this.running) {
        this.running = true;
        this.controller.run();
      }
    },
    destroy() {
      if (this.controller) {
        this.running = false;
        this.controller.destroy();
      }
      document.removeEventListener("keydown", this.onkeydown, false);
      document.removeEventListener("keyup", this.onkeyup, false);
    },
    createRunner(enviro) {
      return builder.createRunner(this, enviro);
    },
    // drawing
    draw(enviro) {
      drawer.draw(this, enviro);
    }
  }
};
</script>
