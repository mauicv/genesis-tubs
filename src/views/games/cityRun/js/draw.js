import engine from "genesis-tubs-engine";
const Line = engine.Line;
const Particle = engine.Particle;

const explosionColors = ["red", "yellow", "orange"];

export default {
  draw: function(ctx, enviro) {
    ctx.drawCtx.fillStyle = "black";
    ctx.drawCtx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    enviro.convexSets.forEach(function(set, i) {
      if ([0, 1, 2, 3, 4].includes(i)) {
        ctx.drawCtx.fillStyle = "blue";
        ctx.drawCtx.strokeStyle = "white";
      } else {
        ctx.drawCtx.strokeStyle = "#111213";
        ctx.drawCtx.fillStyle = "#111213";
      }

      ctx.drawCtx.beginPath();
      ctx.drawCtx.moveTo(set.links[0].from.x[0], set.links[0].from.x[1]);
      set.links.forEach(link => {
        ctx.drawCtx.lineTo(link.to.x[0], link.to.x[1]);
      });
      ctx.drawCtx.closePath();
      ctx.drawCtx.fill();
    }, ctx);

    //draw all links...
    ctx.drawCtx.strokeStyle = "darkgrey";
    enviro.constraints.forEach(function(constraint, i) {
      if (constraint.visable) {
        if (i > 416) {
          ctx.drawCtx.strokeStyle =
            explosionColors[Math.floor(Math.random() * 3)];
        } else {
          ctx.drawCtx.strokeStyle = "grey";
        }
        ctx.drawCtx.beginPath();
        ctx.drawCtx.moveTo(constraint.from.x[0], constraint.from.x[1]);
        ctx.drawCtx.lineTo(constraint.to.x[0], constraint.to.x[1]);
        ctx.drawCtx.stroke();
      }
    }, ctx);

    enviro.points.forEach(function(point) {
      if (point instanceof Particle) {
        ctx.drawCtx.strokeStyle = "grey";
        ctx.drawCtx.beginPath();
        ctx.drawCtx.arc(point.x[0], point.x[1], 1, 0, 1 * Math.PI);
        ctx.drawCtx.stroke();
      }
    });

    // draw all graphics
    ctx.drawCtx.strokeStyle = "white";
    ctx.drawCtx.strokeWidth = "5px";
    enviro.graphics.forEach(function(graphic, i) {
      if (graphic instanceof Line) {
        if (graphic.visable) {
          if ([0, 1, 2, 3, 4, 5, 6].includes(i) && !enviro.gameState.dead) {
            ctx.drawCtx.strokeStyle = "red";
          } else {
            ctx.drawCtx.strokeStyle = "white";
          }

          ctx.drawCtx.beginPath();
          ctx.drawCtx.moveTo(graphic.from.x[0], graphic.from.x[1]);
          ctx.drawCtx.lineTo(graphic.to.x[0], graphic.to.x[1]);
          ctx.drawCtx.stroke();
        }
      } else if (graphic instanceof Particle) {
        ctx.drawCtx.beginPath();
        ctx.drawCtx.arc(graphic.x[0], graphic.x[1], 1, 0, 2 * Math.PI);
        ctx.drawCtx.stroke();
      }
    }, ctx);

    ctx.drawCtx.font = "30px Arial";
    ctx.drawCtx.fillStyle = "red";
    ctx.drawCtx.fillText(enviro.gameState.time.toString().slice(0, -1), 10, 50);
  }
};
