import engine from "genesis-tubs-engine";
const Features = engine.featureInstances;
import Laws from "./laws.js";

import wormRace from "raw-loader!../environment/env.txt";

export default {
  // Setup physics environment
  createEnvironment: function(ctx) {
    var otherEnviro = JSON.parse(JSON.stringify(wormRace));
    var enviro = engine.SL.parseGTBFormat(wormRace);
    var otherWorm = engine.SL.parseGTBFormat(otherEnviro);
    window.data = null;
    otherWorm.points.forEach(point => {
      point.update_x_xd([0, -400]);
      point.update_x_old_xd([0, -400]);
    });

    enviro.builder.addEnvironment(otherWorm);

    otherWorm = null;

    enviro.points.forEach(point => {
      point.update_x_xd([40, -90]);
      point.update_x_old_xd([40, -90]);
    });

    enviro.structures[1].fix();
    enviro.structures[3].fix();

    var worm1 = enviro.structures[0];
    var worm2 = enviro.structures[2];
    worm1.stuff.name = "worm1";
    worm2.stuff.name = "worm2";

    enviro.structures.forEach(function(structure) {
      enviro.builder.addBoundingRect(structure);
      structure.features.push(Features["mass"]);
      enviro.laws.gravity.structures.push(structure);
      enviro.laws.airResistance.structures.push(structure);
    });

    var joints = enviro.constraints.filter(c => c.type == "joint");

    enviro.laws.peristalsisA = Laws.peristalsis(
      [joints[1], joints[2], joints[3]],
      enviro.structures[0].elements[0].links[3].from,
      enviro.structures[1],
      ctx.input.a
    );

    enviro.laws.peristalsisD = Laws.peristalsis(
      [joints[5], joints[4], joints[3]],
      enviro.structures[0].elements[7].links[2].from,
      enviro.structures[1],
      ctx.input.d
    );

    enviro.laws.peristalsisL = Laws.peristalsis(
      [joints[1 + 7], joints[2 + 7], joints[3 + 7]],
      enviro.structures[2].elements[0].links[3].from,
      enviro.structures[3],
      ctx.input.l
    );

    enviro.laws.peristalsisR = Laws.peristalsis(
      [joints[5 + 7], joints[4 + 7], joints[3 + 7]],
      enviro.structures[2].elements[7].links[2].from,
      enviro.structures[3],
      ctx.input.r
    );

    var p1 = enviro.builder.addPoint([(9 * ctx.canvas.width) / 10, 0]);
    var p2 = enviro.builder.addPoint([
      (9 * ctx.canvas.width) / 10,
      ctx.canvas.height
    ]);
    var p3 = enviro.builder.addPoint([ctx.canvas.width, ctx.canvas.height]);
    var p4 = enviro.builder.addPoint([ctx.canvas.width, 0]);
    var convexSet = enviro.builder.addConvexSet([p1, p2, p3, p4]);
    var structure = enviro.builder.addStructure([convexSet], []);
    structure.stuff.name = "finish-line";

    enviro.laws.finishLine = new Laws["finishLine"](
      [enviro.structures[0], enviro.structures[2]],
      structure,
      ctx.winner
    );

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
