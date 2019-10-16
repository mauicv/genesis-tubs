import engine from "genesis-tubs-engine";
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
    ctx.box.outerHeight = ctx.canvas.height / 2 + 300;
    ctx.box.outerWidth = ctx.canvas.width / 2 + 300;

    enviro.structures[5].fix();

    enviro.structures.forEach(function(structure) {
      enviro.builder.addBoundingRect(structure);
      structure.features.push(Features["mass"]);
      structure.randomNudges(2);
    });
    return enviro;
  },

  createRunner: function(ctx, enviro) {
    var draw = ctx.draw;
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
  }
};
