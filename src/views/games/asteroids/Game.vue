<template>
  <canvas id="Canvas" />
</template>

<script>
import engine from "genesis-tubs-engine";
import Laws from "./laws.js";
import asteroid1 from "raw-loader!./environment/asteroid1.txt";
import asteroid2 from "raw-loader!./environment/asteroid2.txt";
import asteroid3 from "raw-loader!./environment/asteroid3.txt";
import iss from "raw-loader!./environment/iss.txt";

const gm = engine.GeneralMethods;
const Features = engine.featureInstances;
const Line = engine.Line;
const Particle = engine.Particle;

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
      gameState: {
        a: { on: false },
        d: { on: false },
        w: { on: false },
        s: { on: false },
        finished: false
      },
      box: {
        center: null,
        height: null,
        width: null,
        outerHeight: null,
        outerWidth: null
      }
    };
  },
  mounted() {
    var canvas = document.getElementById("Canvas");
    var WIDTH = document.documentElement.clientWidth + 230;
    var HEIGHT = document.documentElement.clientHeight + 80;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    var drawCtx = canvas.getContext("2d");
    var rect = canvas.getBoundingClientRect();
    this.canvas = canvas;
    this.drawCtx = drawCtx;
    this.canvasTop = rect.top;
    this.canvasLeft = rect.left;
    var enviro = this.loadEnviroment();
    this.createAndstart(enviro);
  },
  methods: {
    createAndstart(enviro) {
      this.controller = this.createRunner(enviro);
      this.controller.run();
      this.running = true;
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
        this.box = {
          center: null,
          height: null,
          width: null,
          outerHeight: null,
          outerWidth: null
        };
      }
      document.removeEventListener("keydown", this.onkeydown, false);
      document.removeEventListener("keyup", this.onkeyup, false);
    },
    loadEnviroment() {
      var asteroidsEnvironment = engine.SL.parse(iss);

      asteroidsEnvironment.realCenter = [
        this.canvas.width / 2,
        this.canvas.height / 2
      ];

      asteroidsEnvironment.relativeCenter = asteroidsEnvironment.structures[0];
      this.box.center = asteroidsEnvironment.realCenter;
      this.box.height = this.canvas.height / 2;
      this.box.width = this.canvas.width / 2;
      this.box.outerHeight = this.canvas.height / 2 + 300;
      this.box.outerWidth = this.canvas.width / 2 + 300;

      asteroidsEnvironment.laws.thruster1 = Laws.thruster(
        0.02,
        asteroidsEnvironment.convexSets[15].graphics[0],
        asteroidsEnvironment.convexSets.filter((set, i) =>
          [15, 9, 3, 2, 7, 4].includes(i)
        ),
        this.gameState.w
      );

      asteroidsEnvironment.laws.thruster2 = Laws.thruster(
        0.02,
        asteroidsEnvironment.convexSets[12].graphics[0],
        asteroidsEnvironment.convexSets.filter((set, i) =>
          [12, 9, 3, 2, 7, 4].includes(i)
        ),
        this.gameState.s
      );

      asteroidsEnvironment.laws.thruster3 = Laws.thruster(
        0.1,
        asteroidsEnvironment.convexSets[9].graphics[0],
        [asteroidsEnvironment.convexSets[9]],
        this.gameState.a
      );

      asteroidsEnvironment.laws.thruster4 = Laws.thruster(
        0.1,
        asteroidsEnvironment.convexSets[9].graphics[1],
        [asteroidsEnvironment.convexSets[9]],
        this.gameState.d
      );

      asteroidsEnvironment.laws.thruster5 = Laws.thruster(
        0.1,
        asteroidsEnvironment.convexSets[7].graphics[0],
        [asteroidsEnvironment.convexSets[7]],
        this.gameState.a
      );

      asteroidsEnvironment.laws.thruster6 = Laws.thruster(
        0.1,
        asteroidsEnvironment.convexSets[7].graphics[1],
        [asteroidsEnvironment.convexSets[7]],
        this.gameState.d
      );

      var components = [];
      for (var i = 0; i <= 10; i++) {
        components.push(asteroidsEnvironment.structures[i]);
      }
      var beams = [];
      asteroidsEnvironment.constraints.forEach(function(c) {
        if (c.type == "beam") {
          beams.push(c);
        }
      });
      asteroidsEnvironment.laws.issI = Laws.issI(
        asteroidsEnvironment.structures[11],
        components,
        beams,
        this.gameState,
        asteroidsEnvironment
      );

      //Asteroids
      var asteroids = [];
      asteroids.push(engine.SL.parse(asteroid1));
      asteroids.push(engine.SL.parse(asteroid2));
      asteroids.push(engine.SL.parse(asteroid3));

      asteroidsEnvironment.laws.boundary = Laws.boundary(this.box);
      asteroids.forEach(function(a) {
        var centerPoint = a.structures[0].findCenter();
        var y_rand;
        var x_rand;
        if (Math.random() > 0.5) {
          x_rand =
            this.box.center[0] +
            this.box.width +
            Math.random() * (this.box.outerWidth - this.box.width);
        } else {
          x_rand =
            this.box.center[0] -
            this.box.width -
            Math.random() * (this.box.outerWidth - this.box.width);
        }
        if (Math.random() > 0.5) {
          y_rand =
            this.box.center[1] +
            this.box.height +
            Math.random() * (this.box.outerHeight - this.box.height);
        } else {
          y_rand =
            this.box.center[1] -
            this.box.height -
            Math.random() * (this.box.outerHeight - this.box.height);
        }
        var randomPoint = [x_rand, y_rand];

        var diff = gm.minus(randomPoint, centerPoint);
        var randomVel = [(Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3];
        a.convexSets[0].links.forEach(function(link) {
          link.from.x = gm.add(link.from.x, diff);
          link.from.x_old = gm.add(link.from.x_old, diff);
          link.from.update_x_xd(randomVel);
        });
        asteroidsEnvironment.builder.addEnvironment(a);
        asteroidsEnvironment.laws.boundary.structures.push(a.structures[0]);
        asteroidsEnvironment.laws.issI.structures.push(a.structures[0]);
        a.structures[0].features.push(Features["mass"]);
      }, this);

      //bounding boxes
      asteroidsEnvironment.structures.forEach(function(structure) {
        asteroidsEnvironment.builder.addBoundingRect(structure);
      });

      //StarField
      asteroidsEnvironment.laws.starBoundary = Laws.starBoundary(this.box);
      var starField = [];
      for (var j = 0; j < 20; j++) {
        var star = asteroidsEnvironment.builder.addParticle(
          gm.add(this.box.center, [
            Math.random() * this.canvas.width,
            Math.random() * this.canvas.height
          ]),
          1,
          [0, 0]
        );
        asteroidsEnvironment.graphics.push(star);
        starField.push(star);
      }
      asteroidsEnvironment.laws.starBoundary.structures.push(
        asteroidsEnvironment.builder.addStructure(starField, [])
      );

      document.addEventListener("keydown", this.onkeydown, false);
      document.addEventListener("keyup", this.onkeyup, false);

      return asteroidsEnvironment;
    },
    createRunner(enviro) {
      var draw = this.draw;
      var animationRef;

      function run() {
        enviro.timeStep();
        draw(enviro);
        animationRef = window.requestAnimationFrame(run);
      }

      function stop() {
        window.cancelAnimationFrame(animationRef);
      }

      function destroy() {
        stop();
        enviro = null;
        animationRef = null;
      }

      return {
        run: run,
        stop: stop,
        destroy: destroy
      };
    },
    draw(enviro) {
      this.drawCtx.fillStyle = "black";
      this.drawCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.drawCtx.strokeStyle = "white";
      //draw all links...
      var self = this;

      enviro.constraints.forEach(function(constraint, i) {
        if (i < 806) {
          self.drawCtx.strokeStyle = "grey";
        } else {
          self.drawCtx.strokeStyle = "lightgrey";
        }
        if (constraint.visable) {
          self.drawCtx.beginPath();
          self.drawCtx.moveTo(constraint.from.x[0], constraint.from.x[1]);
          self.drawCtx.lineTo(constraint.to.x[0], constraint.to.x[1]);
          self.drawCtx.stroke();
        }
      }, self);

      this.drawCtx.strokeStyle = "white";
      enviro.graphics.forEach(function(graphic) {
        if (graphic instanceof Line) {
          if (graphic.visable) {
            if (graphic.name == "thrustLine") {
              self.drawCtx.strokeStyle = "red";
            } else {
              self.drawCtx.strokeStyle = "lightgrey";
            }
            self.drawCtx.beginPath();
            self.drawCtx.moveTo(graphic.from.x[0], graphic.from.x[1]);
            self.drawCtx.lineTo(graphic.to.x[0], graphic.to.x[1]);
            self.drawCtx.stroke();
          }
        } else if (graphic instanceof Particle) {
          self.drawCtx.beginPath();
          self.drawCtx.arc(graphic.x[0], graphic.x[1], 1, 0, 2 * Math.PI);
          self.drawCtx.stroke();
        }
      }, self);
    },
    onkeydown(event) {
      if (!this.gameState.finished) {
        if (event.keyCode == 65) {
          this.gameState.a.on = true;
        } else if (event.keyCode == 68) {
          this.gameState.d.on = true;
        } else if (event.keyCode == 87) {
          this.gameState.w.on = true;
        } else if (event.keyCode == 83) {
          this.gameState.s.on = true;
        } else if (event.keyCode == 32) {
          if (this.running) {
            this.stop();
          } else {
            this.start();
          }
        }
      } else {
        if (event.keyCode == 32) {
          this.restart();
          this.gameState.finished = false;
        }
      }
    },
    onkeyup(event) {
      if (event.keyCode == 65) {
        this.gameState.a.on = false;
      } else if (event.keyCode == 68) {
        this.gameState.d.on = false;
      } else if (event.keyCode == 87) {
        this.gameState.w.on = false;
      } else if (event.keyCode == 83) {
        this.gameState.s.on = false;
      }
    }
  }
};
</script>
