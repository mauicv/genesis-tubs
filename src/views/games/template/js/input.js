export default {
  keydown: function(ctx, key) {
    if (key == 65) {
      ctx.input.a.on = true;
    } else if (key == 68) {
      ctx.input.d.on = true;
    } else if (key == 87) {
      ctx.input.w.on = true;
    } else if (key == 83) {
      ctx.input.s.on = true;
    }
  },
  keyup: function(ctx, key) {
    if (key == 65) {
      ctx.input.a.on = false;
    } else if (key == 68) {
      ctx.input.d.on = false;
    } else if (key == 87) {
      ctx.input.w.on = false;
    } else if (key == 83) {
      ctx.input.s.on = false;
    }
  }
};
