import engine from "genesis-tubs-engine";
const gm = engine.GeneralMethods;
const Law = engine.Law;

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
export default {
  gravity: (function() {
    var gravity = new Law("Gravity");
    gravity.effects = function() {
      this.applyToAllPoints(function(point) {
        point.update_x_xd([0, 0.001]);
      });
    };
    return gravity;
  })(),

  airResistance: (function() {
    var airResistance = new Law("AirResistance");
    //airResistance.frictionalConstant=0.001;
    airResistance.effects = function() {
      this.applyToAllPoints(function(point) {
        point.update_x_xd(gm.mult(gm.minus(point.x_old, point.x), 0.001));
      });
    };
    return airResistance;
  })(),

  finite: (function() {
    var finite = new Law("lifeTime");
    finite.effects = function() {
      this.applyToStructures(function(structure) {
        if (structure.alive) {
          if (structure.stuff.age > structure.stuff.lifeLength) {
            structure.kill();
          } else {
            structure.stuff.age++;
          }
        }
      });
    };
    return finite;
  })(),

  boundary: function(box) {
    var boundary = new Law("boundary");
    boundary.box = box;
    boundary.effects = function() {
      this.applyToStructures(function(structure) {
        var center = gm.minus(structure.stuff.center.x, box.center);
        if (center[0] > box.outerWidth) {
          structure.elements.forEach(function(element) {
            element.links.forEach(function(link) {
              link.from.update_x_xd([-box.outerWidth * 2, 0]);
              link.from.update_x_old_xd([-box.outerWidth * 2, 0]);
            });
          });
        } else if (center[0] < -box.outerWidth) {
          structure.elements.forEach(function(element) {
            element.links.forEach(function(link) {
              link.from.update_x_xd([box.outerWidth * 2, 0]);
              link.from.update_x_old_xd([box.outerWidth * 2, 0]);
            });
          });
        } else if (center[1] > box.outerHeight) {
          structure.elements.forEach(function(element) {
            element.links.forEach(function(link) {
              link.from.update_x_xd([0, -box.outerHeight * 2]);
              link.from.update_x_old_xd([0, -box.outerHeight * 2]);
            });
          });
        } else if (center[1] < -box.outerHeight) {
          structure.elements.forEach(function(element) {
            element.links.forEach(function(link) {
              link.from.update_x_xd([0, box.outerHeight * 2]);
              link.from.update_x_old_xd([0, box.outerHeight * 2]);
            });
          });
        }
      });
    };
    return boundary;
  },

  thruster: function(strength, vector, convexSets, util) {
    var thruster = new Law("thruster");
    thruster.vectorSize = gm.size(vector.to.x, vector.from.x);
    thruster.vector = vector;
    thruster.vector.name = "thrustLine";
    thruster.convexSets = convexSets;
    thruster.util = util;

    thruster.effects = function() {
      thruster.convexSets.forEach(function(convexSet) {
        if (convexSet.alive) {
          thruster.vector.visable = false;
          if (thruster.util.on) {
            thruster.vector.visable = true;
            var v = gm.dev(
              gm.minus(thruster.vector.to.x, thruster.vector.from.x),
              -thruster.vectorSize
            );
            convexSet.links.forEach(function(link) {
              link.from.update_x_xd(gm.mult(v, strength));
            });
          }
        }
      }, thruster);
    };
    return thruster;
  },

  collisionLaw: function(structure, enviro, beams) {
    var collisionLaw = new Law("collisionLaw");
    collisionLaw.structure = structure;
    collisionLaw.enviro = enviro;
    collisionLaw.health = 4;
    collisionLaw.beams = beams;

    collisionLaw.effects = function() {
      this.applyToStructures(function(structure) {
        if (structure.CheckBoundingRect(collisionLaw.structure)) {
          var reports = structure.checkProximityTo(collisionLaw.structure, 0);
          reports.forEach(function(report) {
            if (report.depth < -1) {
              this.health = this.health - 1;
              if (this.health == 0) {
                var set = report.collisionPair.find(function(set) {
                  return collisionLaw.structure.elements.includes(set);
                });
                set.angleLinks.forEach(function(angleLink) {
                  angleLink.alive = false;
                });
                this.enviro.builder.addExplodeStucture(
                  20,
                  5,
                  6,
                  3,
                  [0, 0],
                  0,
                  report.point.x,
                  1,
                  [],
                  false
                );
                this.enviro.builder.addExplodeStucture(
                  20,
                  5,
                  20,
                  2,
                  [0, 0],
                  0,
                  report.point.x,
                  1,
                  [],
                  false
                );
              }
              this.enviro.builder.addExplodeStucture(
                3,
                4,
                5,
                1,
                gm.minus(report.point.x, report.point.x_old),
                0,
                report.point.x,
                1,
                [],
                false
              );
            }
            if (report.depth < -2) {
              this.structure.randomNudges(1);
              this.beams.forEach(function(beam) {
                beam.alive = false;
              });
            }
          }, collisionLaw);
        }
      });
    };
    return collisionLaw;
  }
};
