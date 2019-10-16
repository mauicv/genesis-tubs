import engine from "genesis-tubs-engine";
import Laws from "./laws.js";
const Features = engine.featureInstances;

import example from "raw-loader!../environment/env.txt";

export default {
  // Setup physics environment
  createEnvironment: function(ctx) {
    var enviro = engine.SL.parseGTBFormat(example);
    window.data = null;
    enviro.realCenter = [ctx.canvas.width / 2, ctx.canvas.height / 2];

    enviro.relativeCenter = enviro.structures[2];
    ctx.box.center = enviro.realCenter;
    ctx.box.height = ctx.canvas.height / 2;
    ctx.box.width = ctx.canvas.width / 2;
    // ctx.box.outerHeight = ctx.canvas.height / 2 + 300;
    // ctx.box.outerWidth = ctx.canvas.width / 2 + 300;

    enviro.structures[6].fix();

    enviro.structures.forEach(function(structure, index) {
      enviro.builder.addBoundingRect(structure);
      if ([0, 1, 2, 3, 4, 5, 6].includes(index)) {
        structure.features.push(Features["mass"]);
      }

      if ([0, 1, 2, 3, 4].includes(index)) {
        enviro.laws.gravity.structures.push(structure);
        enviro.laws.airResistance.structures.push(structure);
      }
    });

    enviro.gameState = {
      dead: false,
      finished: false,
      time: 0
    };

    var beams = enviro.constraints.filter(c => c.type == "beam");
    enviro.laws.collisionLaw = Laws.collisionLaw({
      structure: enviro.structures[5],
      enviro: enviro,
      beams: beams,
      gameState: enviro.gameState
    });
    enviro.laws.collisionLaw.structures.push(enviro.structures[6]);

    enviro.laws.course = Laws.course({
      start: enviro.structures[7].elements[1],
      mid: enviro.structures[7].elements[2],
      finish: enviro.structures[7].elements[0],
      ship: enviro.convexSets[0],
      gameState: enviro.gameState
    });

    enviro.laws.thruster1 = Laws.thruster(
      0.0012,
      enviro.convexSets[1].graphics[0],
      enviro.convexSets.filter((set, i) => [0, 1, 2, 3, 4].includes(i)),
      ctx.input.w,
      enviro.gameState
    );

    enviro.laws.thruster2 = Laws.thruster(
      0.0012,
      enviro.convexSets[2].graphics[2],
      enviro.convexSets.filter((set, i) => [0, 1, 2, 3, 4].includes(i)),
      ctx.input.w,
      enviro.gameState
    );

    enviro.laws.thruster3 = Laws.thruster(
      0.005,
      enviro.convexSets[1].graphics[2],
      enviro.convexSets.filter((set, i) => [1].includes(i)),
      ctx.input.a,
      enviro.gameState
    );

    enviro.laws.thruster4 = Laws.thruster(
      0.005,
      enviro.convexSets[2].graphics[0],
      enviro.convexSets.filter((set, i) => [2].includes(i)),
      ctx.input.d,
      enviro.gameState
    );

    return enviro;
  },

  createRunner: function(ctx, enviro) {
    var draw = ctx.draw;
    var animationRef;
    var state = { finished: false };

    function run() {
      if (enviro.gameState.dead || enviro.gameState.finished) {
        state.finished = true;
      }
      console.log("city run");
      enviro.timeStep();
      draw(enviro);
      animationRef = window.requestAnimationFrame(run);
    }

    function stop() {
      window.cancelAnimationFrame(animationRef);
    }

    function destroy() {
      stop();
      enviro.builder.cleanEnvironment();
      // enviro = null;
      animationRef = null;
      draw = null;
      ctx.box = {
        center: null,
        height: null,
        width: null,
        outerHeight: null,
        outerWidth: null
      };
    }

    return {
      state: state,
      run: run,
      stop: stop,
      destroy: destroy
    };
  }
};
