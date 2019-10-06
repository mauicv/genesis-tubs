import engine from "genesis-tubs-engine";
const Line = engine.Line;
const Particle = engine.Particle;

export default {
  draw: function(ctx, enviro) {
    ctx.drawCtx.fillStyle = "black";
    ctx.drawCtx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    //draw all links...
    ctx.drawCtx.strokeStyle = "white";
    enviro.constraints.forEach(function(constraint) {
      if (constraint.visable) {
        ctx.drawCtx.beginPath();
        ctx.drawCtx.moveTo(constraint.from.x[0], constraint.from.x[1]);
        ctx.drawCtx.lineTo(constraint.to.x[0], constraint.to.x[1]);
        ctx.drawCtx.stroke();
      }
    }, ctx);

    // draw all graphics
    ctx.drawCtx.strokeStyle = "white";
    enviro.graphics.forEach(function(graphic) {
      if (graphic instanceof Line) {
        if (graphic.visable) {
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
  }
};
