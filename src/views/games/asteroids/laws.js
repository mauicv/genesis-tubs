import engine from "genesis-tubs-engine";
const gm = engine.GeneralMethods;
const Law = engine.Law;
const cr = engine.CollisionResponse;

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

  starBoundary: function(box) {
    var starBoundary = new Law("starBoundary");
    starBoundary.box = box;
    starBoundary.effects = function() {
      starBoundary.structures.forEach(function(starFeild) {
        starFeild.elements.forEach(function(star) {
          var center = gm.minus(star.x, box.center);
          if (center[0] > box.width) {
            star.update_x_xd([-box.width * 2, 0]);
            star.update_x_old_xd([-box.width * 2, 0]);
          }
          if (center[0] < -box.width) {
            star.update_x_xd([box.width * 2, 0]);
            star.update_x_old_xd([box.width * 2, 0]);
          }
          if (center[1] > box.height) {
            star.update_x_xd([0, -box.height * 2]);
            star.update_x_old_xd([0, -box.height * 2]);
          }
          if (center[1] < -box.height) {
            star.update_x_xd([0, box.height * 2]);
            star.update_x_old_xd([0, box.height * 2]);
          }
        });
      });
    };
    return starBoundary;
  },

  //adding Thrusters in a general manner
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

  issI: function(iss, components, beams, state, enviro) {
    var issI = new Law("issInteraction");
    issI.environment = enviro;
    issI.iss = iss;
    issI.components = components;
    issI.beams = beams;
    issI.gameState = state;

    issI.effects = function() {
      issI.applyToStructures(function(structure) {
        var newComponents = [];
        var boolUpdateIss = false;

        if (structure.CheckBoundingRect(issI.iss)) {
          issI.components.forEach(function(component) {
            var boolKeepComponent = true;

            var reports = structure.checkProximityTo(component, 0);
            reports.forEach(function(report) {
              if (report.collision) {
                var v_i = cr.SCR(report);
                issI.iss.randomNudges(gm.len(gm.mult(v_i, -1)));
                if (gm.len(v_i) > 0) {
                  issI.gameState.finished = true;
                  issI.gameState.a.on = false;
                  issI.gameState.d.on = false;
                  issI.gameState.s.on = false;
                  issI.gameState.w.on = false;

                  issI.beams.forEach(function(beam) {
                    beam.active = false;
                  });

                  cr.destroy(component);
                  boolKeepComponent = false;
                  boolUpdateIss = true;
                  // addExplodeStucture(components,n,size,strength,vel,lifeLength,at,connectedDensity,features,gravity){
                  issI.environment.builder.addExplodeStucture(
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
              }
            });
            if (boolKeepComponent) {
              newComponents.push(component);
            }
          });
          issI.components = newComponents;
          if (boolUpdateIss && issI.components.length > 0) {
            var newIssSets = [];
            issI.components.forEach(function(component) {
              component.elements.forEach(function(set) {
                newIssSets.push(set);
              });
            });
            issI.iss.elements = newIssSets;
            var [c, r] = issI.iss.findBoundingRect();
            issI.iss.stuff.center.x = c;
            issI.iss.stuff.center.fixTo(issI.iss);
            issI.iss.stuff.r = r;
          }
        }
      });
    };
    return issI;
  }
};
