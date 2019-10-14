import engine from "genesis-tubs-engine";
const gm = engine.GeneralMethods;
const cc = engine.CollisionChecker;
const Law = engine.Law;

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
export default {
  gravity: (function() {
    var gravity = new Law("Gravity");
    gravity.effects = function() {
      this.applyToAllPoints(function(point) {
        point.update_x_xd([0, 0.005]);
      });
    };
    return gravity;
  })(),

  airResistance: (function() {
    var airResistance = new Law("AirResistance");
    //airResistance.frictionalConstant=0.001;
    airResistance.effects = function() {
      this.applyToAllPoints(function(point) {
        point.update_x_xd(gm.mult(gm.minus(point.x_old, point.x), 0.00001));
      });
    };
    return airResistance;
  })(),

  peristalsis: function(benders, gripper, ground, util) {
    var peristalsis = new Law("peristalsis");

    peristalsis.util = util;
    peristalsis.benders = benders;
    peristalsis.gripper = gripper;
    peristalsis.active = false;

    peristalsis.effects = function() {
      if (peristalsis.util.on) {
        if (!peristalsis.active) {
          peristalsis.benders.forEach(bender => {
            bender.angle = 4;
            bender.rigidityConstant = 0.05;
          });
          ground.elements.forEach(e => {
            if (cc.xInB(gripper.x, e.links) < 1) {
              peristalsis.active = true;
              peristalsis.gripper.setStatic();
              setTimeout(() => {
                peristalsis.gripper.setActive();
                peristalsis.benders.forEach(bender => {
                  bender.angle = 3;
                  bender.rigidityConstant = 0.005;
                });
              }, 700);
              setTimeout(() => {
                peristalsis.active = false;
              }, 1000);
            }
          });
        }
      } else {
        peristalsis.benders.forEach(bender => {
          bender.angle = 3;
          bender.rigidityConstant = 0.005;
        });
        peristalsis.gripper.setActive();
      }
    };
    return peristalsis;
  },

  finishLine: function(worms, finishBox, winner) {
    var finishLine = new Law("finishLine");
    finishLine.worms = worms;
    finishLine.winner = winner;
    finishLine.finishBox = finishBox;
    finishLine.finished = false;

    console.log(finishLine.winner);

    finishLine.effects = function() {
      finishLine.worms.forEach(worm => {
        if (!finishLine.finished) {
          var reports = worm.checkProximityTo(finishBox, 0);
          if (reports.length > 0) {
            reports[0].collisionPair.forEach(convexSet => {
              var structName = convexSet.belongsTo[0].stuff.name;
              if (structName == "worm1" || structName == "worm2") {
                finishLine.winner.worm = structName;
                finishLine.finished = true;
              }
            });
          }
        }
      });
    };
    return finishLine;
  }
};
