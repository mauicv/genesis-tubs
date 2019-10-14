export default {
  keydown: function(ctx, key) {
    if (key == 65) {
      ctx.input.a.on = true;
    } else if (key == 68) {
      ctx.input.d.on = true;
    } else if (key == 39) {
      ctx.input.r.on = true;
    } else if (key == 37) {
      ctx.input.l.on = true;
    }
  },
  keyup: function(ctx, key) {
    if (key == 65) {
      ctx.input.a.on = false;
    } else if (key == 68) {
      ctx.input.d.on = false;
    } else if (key == 39) {
      ctx.input.r.on = false;
    } else if (key == 37) {
      ctx.input.l.on = false;
    }
  }
};
