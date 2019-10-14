import engine from "genesis-tubs-engine";
const gm = engine.GeneralMethods;
const cr = engine.CollisionResponse;
const cc = engine.CollisionChecker;
const Feature = engine.Feature;
import particles from "./particleTypes.js";
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

var interactions = {
  A: {
    A: 0.1,
    B: -0.03,
    D: 0.01,
    E: 0.01
  },
  B: {
    B: 0.1,
    A: -0.03,
    D: 0.01,
    E: 0.01
  },
  D: {
    A: 0,
    B: 0.1,
    D: 0.05,
    E: -0.05
  },
  E: {
    A: 0.1,
    B: 0,
    D: -0.05,
    E: 0.05
  }
};

export default {
  interactionLaws: (function() {
    var interactionLaws = new Feature("interactionLaws");
    interactionLaws.interaction = function(structure1, structure2) {
      var interactionStrength =
        interactions[structure1.stuff.v.name][structure2.stuff.v.name];
      if (interactionStrength != undefined) {
        interactionStrength = interactionStrength * 0.00005;
        var x = structure1.elements[0].x;
        var y = structure2.elements[0].x;
        var colVector = gm.norm(gm.minus(x, y));
        //update x & y:

        structure1.elements[0].update_x_xd(
          gm.mult(colVector, -interactionStrength)
        );
        structure2.elements[0].update_x_xd(
          gm.mult(colVector, interactionStrength)
        );

        // structure1.stuff.v = types.find(p=>p.name == interactionType)
        // structure2.stuff.v = types.find(p=>p.name == interactionType)
      }

      var reports = structure1.checkProximityTo(structure2, 0);
      reports.forEach(function(report) {
        if (
          report.depth < 0 &&
          structure1.stuff.v.name != "D" &&
          structure2.stuff.v.name != "D" &&
          structure1.stuff.v.name != "E" &&
          structure2.stuff.v.name != "E"
        ) {
          cr.particleResponse(report);
        }
      });
    };
    return interactionLaws;
  })()
};
