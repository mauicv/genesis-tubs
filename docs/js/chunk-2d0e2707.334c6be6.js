(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0e2707"],{"7f68":function(n,i,e){"use strict";e.r(i);e("7f7f"),e("ac6a");var t=e("3be1"),o=e.n(t),r=o.a.GeneralMethods,s=o.a.CollisionChecker,a=o.a.Law;i["default"]={gravity:function(){var n=new a("Gravity");return n.effects=function(){this.applyToAllPoints((function(n){n.update_x_xd([0,.005])}))},n}(),airResistance:function(){var n=new a("AirResistance");return n.effects=function(){this.applyToAllPoints((function(n){n.update_x_xd(r.mult(r.minus(n.x_old,n.x),1e-5))}))},n}(),peristalsis:function(n,i,e,t){var o=new a("peristalsis");return o.util=t,o.benders=n,o.gripper=i,o.active=!1,o.effects=function(){o.util.on?o.active||(o.benders.forEach((function(n){n.angle=4,n.rigidityConstant=.05})),e.elements.forEach((function(n){s.xInB(i.x,n.links)<1&&(o.active=!0,o.gripper.setStatic(),setTimeout((function(){o.gripper.setActive(),o.benders.forEach((function(n){n.angle=3,n.rigidityConstant=.005}))}),700),setTimeout((function(){o.active=!1}),1e3))}))):(o.benders.forEach((function(n){n.angle=3,n.rigidityConstant=.005})),o.gripper.setActive())},o},finishLine:function(n,i,e){var t=new a("finishLine");return t.worms=n,t.winner=e,t.finishBox=i,t.finished=!1,t.effects=function(){t.worms.forEach((function(n){if(!t.finished){var e=n.checkProximityTo(i,0);e.length>0&&e[0].collisionPair.forEach((function(n){var i=n.belongsTo[0].stuff.name;"worm1"!=i&&"worm2"!=i||(t.winner.worm=i,t.finished=!0)}))}}))},t}}}}]);
//# sourceMappingURL=chunk-2d0e2707.334c6be6.js.map