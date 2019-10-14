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
        point.update_x_xd(gm.mult(gm.minus(point.x_old, point.x), 0.1));
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

  thruster: function(strength, vector, convexSets, util, gameState) {
    var thruster = new Law("thruster");
    thruster.vectorSize = gm.size(vector.to.x, vector.from.x);
    thruster.vector = vector;
    thruster.vector.name = "thrustLine";
    thruster.convexSets = convexSets;
    thruster.util = util;
    thruster.gameState = gameState;

    thruster.effects = function() {
      if (gameState.dead) {
        thruster.vector.visable = false;
        return;
      }
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

  course: function({ start, mid, finish, ship, gameState }) {
    var course = new Law("course");
    course.startPoint = start;
    course.midPoint = mid;
    course.finishPoint = finish;
    course.gameTime = 0;
    course.raceInProgress = false;
    course.ship = ship;
    course.progress = {
      start: false,
      mid: false,
      finish: false
    };

    course.effects = function() {
      var d;
      if (
        !course.progress.start &&
        !course.progress.mid &&
        !course.progress.finish
      ) {
        d = course.startPoint.distanceFrom(ship.findCenter());
        course.progress.start = d < 0;
        course.raceInProgress = d < 0;
      } else if (
        course.progress.start &&
        !course.progress.mid &&
        !course.progress.finish
      ) {
        d = course.midPoint.distanceFrom(ship.findCenter());
        course.progress.mid = d < 0;
        course.progress.start = !(d < 0);
      } else if (
        !course.progress.start &&
        course.progress.mid &&
        !course.progress.finish
      ) {
        d = course.startPoint.distanceFrom(ship.findCenter());
        if (d < 0) {
          course.progress.start = d < 0;
          course.progress.mid = !(d < 0);
          course.progress.finish = !(d < 0);
        }

        d = course.finishPoint.distanceFrom(ship.findCenter());
        course.progress.finish = d < 0;
        course.raceInProgress = !(d < 0);
      }
      if (!course.raceInProgress && course.progress.finish) {
        gameState.finished = true;
      } else if (course.raceInProgress) {
        course.gameTime++;
        gameState.time++;
      }
    };

    return course;
  },

  collisionLaw: function({ structure, enviro, beams, gameState }) {
    var collisionLaw = new Law("collisionLaw");
    collisionLaw.structure = structure;
    collisionLaw.enviro = enviro;
    collisionLaw.health = 4;
    collisionLaw.beams = beams;
    collisionLaw.gameState = gameState;

    collisionLaw.effects = function() {
      this.applyToStructures(function(structure) {
        if (structure.CheckBoundingRect(collisionLaw.structure)) {
          var reports = structure.checkProximityTo(collisionLaw.structure, 0);
          reports.forEach(function(report) {
            if (report.depth < -0.2 && report.depth > -1) {
              explosion(this, report, 100, "sparks");
            } else if (report.depth < -1 && report.depth > -2) {
              this.health = this.health - 1;
              if (this.health < 0) {
                collisionLaw.gameState.dead = true;
                var set = report.collisionPair.find(function(set) {
                  return collisionLaw.structure.elements.includes(set);
                });
                set.angleLinks.forEach(function(angleLink) {
                  angleLink.alive = false;
                });
                explosion(this, report, 3000, "meduim");
                explosion(this, report, 3000, "big");
              }
              explosion(this, report, 300, "small");
            } else if (report.depth < -2) {
              collisionLaw.gameState.dead = true;
              this.structure.randomNudges(1);
              this.beams.forEach(function(beam) {
                beam.alive = false;
              });
              this.structure.elements.forEach(element => {
                element.angleLinks.forEach(angleLink => {
                  angleLink.alive = false;
                });
              });
              explosion(this, report, 3000, "big");
            }
          }, collisionLaw);
        }
      });
    };
    return collisionLaw;
  }
};

function explosion(law, report, duration, size) {
  if (law.enviro.structures.length > 200) return;
  if (size == "big") {
    law.enviro.builder.addExplodeStucture(
      20,
      5,
      10,
      2,
      [0, 0],
      duration,
      report.point.x,
      1,
      [],
      true
    );
  } else if (size == "meduim") {
    law.enviro.builder.addExplodeStucture(
      20,
      5,
      6,
      3,
      [0, 0],
      duration,
      report.point.x,
      1,
      [],
      true
    );
  } else if (size == "small") {
    law.enviro.builder.addExplodeStucture(
      3,
      4,
      5,
      1,
      gm.minus(report.point.x, report.point.x_old),
      duration,
      report.point.x,
      1,
      [],
      true
    );
  } else if (size == "sparks") {
    law.enviro.builder.addExplodeStucture(
      1,
      2,
      2,
      1,
      [0, 0],
      duration,
      report.point.x,
      1,
      [],
      true
    );
  }
}
