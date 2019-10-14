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
  }
};
