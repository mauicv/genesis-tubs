import engine from "genesis-tubs-engine";

export default {
  draw: function(ctx, enviro) {
    // ctx.drawCtx.fillStyle = "black";
    ctx.drawCtx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.drawCtx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    enviro.structures.forEach(particle => {
      ctx.drawCtx.fillStyle = particle.stuff.v.color;
      var point = particle.elements[0];
      ctx.drawCtx.beginPath();
      ctx.drawCtx.arc(
        point.x[0],
        point.x[1],
        particle.stuff.v.radius,
        0,
        2 * Math.PI
      );
      ctx.drawCtx.fill();
    });
  }
};
