import engine from "genesis-tubs-engine";
const Line = engine.Line;
const Particle = engine.Particle;

export default {
  draw: function(ctx, enviro) {
    ctx.drawCtx.fillStyle = "#84ae7f";
    ctx.drawCtx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    var worms = [
      [
        enviro.structures[0].elements[0].links[0].from,
        enviro.structures[0].elements[0].links[1].from,
        enviro.structures[0].elements[0].links[2].from,
        enviro.structures[0].elements[0].links[3].from,
        enviro.structures[0].elements[1].links[1].from,
        enviro.structures[0].elements[1].links[2].from,
        enviro.structures[0].elements[2].links[1].from,
        enviro.structures[0].elements[2].links[2].from,
        enviro.structures[0].elements[3].links[1].from,
        enviro.structures[0].elements[3].links[2].from,
        enviro.structures[0].elements[4].links[1].from,
        enviro.structures[0].elements[4].links[2].from,
        enviro.structures[0].elements[5].links[1].from,
        enviro.structures[0].elements[5].links[2].from,
        enviro.structures[0].elements[6].links[1].from,
        enviro.structures[0].elements[6].links[2].from,
        enviro.structures[0].elements[7].links[1].from,
        enviro.structures[0].elements[7].links[2].from,
        enviro.structures[0].elements[7].links[3].from,
        enviro.structures[0].elements[7].links[4].from,
        enviro.structures[0].elements[7].links[5].from,
        enviro.structures[0].elements[6].links[4].from,
        enviro.structures[0].elements[6].links[5].from,
        enviro.structures[0].elements[5].links[4].from,
        enviro.structures[0].elements[5].links[5].from,
        enviro.structures[0].elements[4].links[4].from,
        enviro.structures[0].elements[4].links[5].from,
        enviro.structures[0].elements[3].links[4].from,
        enviro.structures[0].elements[3].links[5].from,
        enviro.structures[0].elements[2].links[4].from,
        enviro.structures[0].elements[2].links[5].from,
        enviro.structures[0].elements[1].links[4].from,
        enviro.structures[0].elements[1].links[5].from
      ],
      [
        enviro.structures[2].elements[0].links[0].from,
        enviro.structures[2].elements[0].links[1].from,
        enviro.structures[2].elements[0].links[2].from,
        enviro.structures[2].elements[0].links[3].from,
        enviro.structures[2].elements[1].links[1].from,
        enviro.structures[2].elements[1].links[2].from,
        enviro.structures[2].elements[2].links[1].from,
        enviro.structures[2].elements[2].links[2].from,
        enviro.structures[2].elements[3].links[1].from,
        enviro.structures[2].elements[3].links[2].from,
        enviro.structures[2].elements[4].links[1].from,
        enviro.structures[2].elements[4].links[2].from,
        enviro.structures[2].elements[5].links[1].from,
        enviro.structures[2].elements[5].links[2].from,
        enviro.structures[2].elements[6].links[1].from,
        enviro.structures[2].elements[6].links[2].from,
        enviro.structures[2].elements[7].links[1].from,
        enviro.structures[2].elements[7].links[2].from,
        enviro.structures[2].elements[7].links[3].from,
        enviro.structures[2].elements[7].links[4].from,
        enviro.structures[2].elements[7].links[5].from,
        enviro.structures[2].elements[6].links[4].from,
        enviro.structures[2].elements[6].links[5].from,
        enviro.structures[2].elements[5].links[4].from,
        enviro.structures[2].elements[5].links[5].from,
        enviro.structures[2].elements[4].links[4].from,
        enviro.structures[2].elements[4].links[5].from,
        enviro.structures[2].elements[3].links[4].from,
        enviro.structures[2].elements[3].links[5].from,
        enviro.structures[2].elements[2].links[4].from,
        enviro.structures[2].elements[2].links[5].from,
        enviro.structures[2].elements[1].links[4].from,
        enviro.structures[2].elements[1].links[5].from
      ]
    ];

    worms.forEach(worm => {
      ctx.drawCtx.strokeStyle = "black";
      ctx.drawCtx.beginPath();
      ctx.drawCtx.moveTo(worm[0].x, worm[0].y);

      for (var i = 0; i < worm.length + 2; i++) {
        var xc =
          (worm[i % worm.length].x[0] + worm[(i + 1) % worm.length].x[0]) / 2;
        var yc =
          (worm[i % worm.length].x[1] + worm[(i + 1) % worm.length].x[1]) / 2;
        ctx.drawCtx.quadraticCurveTo(
          worm[i % worm.length].x[0],
          worm[i % worm.length].x[1],
          xc,
          yc
        );
      }
      ctx.drawCtx.stroke();
      ctx.drawCtx.fillStyle = "pink";
      ctx.drawCtx.fill();
    });

    var finishLine = enviro.structures
      .find(s => s.stuff.name == "finish-line")
      .elements.map(ele => {
        return ele.links.find((l, i) => i == 0);
      })[0];

    ctx.drawCtx.setLineDash([5, 3]);
    ctx.drawCtx.beginPath();
    ctx.drawCtx.moveTo(finishLine.from.x[0], finishLine.from.x[1]);
    ctx.drawCtx.lineTo(finishLine.to.x[0], finishLine.to.x[1]);
    ctx.drawCtx.stroke();
    ctx.drawCtx.setLineDash([]);

    if (ctx.winner.worm != null) {
      ctx.drawCtx.font = "30px Arial";
      ctx.drawCtx.fillStyle = "red";
      ctx.drawCtx.fillText(
        `winner: ${ctx.winner.worm}`,
        ctx.canvas.width / 2 - 90,
        50
      );
    }
  }
};
