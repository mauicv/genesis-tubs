import engine from "genesis-tubs-engine";
const Law = engine.lawInstances;
import Features from "./features.js";
import particles from "./particleTypes.js";

export default {
  // Setup physics environment
  createEnvironment: function(ctx) {
    var builder = new engine.Builder();
    var enviro = builder.returnEnviro();

    // ctx.canvasTop
    // ctx.canvasLeft

    for (var i = 0; i < 120; i++) {
      var y = Math.random() * ctx.canvas.height;
      var x = Math.random() * ctx.canvas.width;
      builder.addParticle([x, y], 4, [0, 0]);
    }

    enviro.points.forEach(point => {
      var structure = builder.addStructure([point], []);
      structure.stuff.v =
        particles.particleTypes[Math.floor(Math.random() * 4)];
    });

    enviro.laws.bowl = Law["bowl"](
      [ctx.canvas.width / 2, ctx.canvas.height / 2],
      2
    );
    enviro.laws.bowl.structures = enviro.structures;

    var interactions = Features.interactionLaws;
    enviro.structures.forEach(function(structure) {
      structure.features.push(interactions);
    });
    // enviro.timeStep();
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
      enviro.builder.cleanEnvironment();
      // enviro = null;
      animationRef = null;
    }

    return {
      run: run,
      stop: stop,
      destroy: destroy
    };
  }
};
