var CANVAS_INFO = {
    "id": "Live2D_",
    "name": "haru",
    "width": 500,
    "height": 500,
    "x": 250,
    "y": 250,
    "scaleX": 400,
    "scaleY": 400,
    "transparent": true,
};
var MODEL_INFO;
var Live2Dno = 0;
var Live2Dcan = [];
function live2d_new(model_id, can_left, can_top, can_width, can_height, can_zindex, can_opacity, can_visible, gl_left, gl_top, gl_scale, parent_id, cb) {
    if (can_left === void 0) { can_left = 0; }
    if (can_top === void 0) { can_top = 0; }
    if (can_width === void 0) { can_width = TYRANO.kag.config.scWidth; }
    if (can_height === void 0) { can_height = TYRANO.kag.config.scHeight; }
    if (can_zindex === void 0) { can_zindex = "12"; }
    if (can_opacity === void 0) { can_opacity = "0.0"; }
    if (can_visible === void 0) { can_visible = false; }
    if (gl_left === void 0) { gl_left = 0.0; }
    if (gl_top === void 0) { gl_top = 0.0; }
    if (gl_scale === void 0) { gl_scale = 1.0; }
    if ($("#Live2D_" + model_id).get(0)) {
        $("#Live2D_" + model_id).remove();
    }
    var app = new PIXI.Application(CANVAS_INFO.width, CANVAS_INFO.height, { transparent: CANVAS_INFO.transparent });
    PIXI.loader.add("ModelJson", LIVE2D_MODEL[model_id].filepath + LIVE2D_MODEL[model_id].modeljson, { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });
    PIXI.loader.load(function (loader, resources) {
        var can = resources["ModelJson"].data;
        app.view.id = CANVAS_INFO.id + model_id;
        app.view.style.left = can_left + "px";
        app.view.style.top = can_top + "px";
        app.view.style.width = can_width;
        app.view.style.height = can_height;
        app.view.style.zIndex = can_zindex;
        app.view.style.opacity = can_opacity;
        app.view.style.position = 'absolute';
        var target_layer = TYRANO.kag.layer.getLayer("0", "fore");
        target_layer.show();
        target_layer.append($(app.view));
        var live2d_model = {
            "model_id": model_id,
            "can_left": can_left,
            "can_top": can_top,
            "can_width": can_width,
            "can_height": can_height,
            "can_zindex": can_zindex,
            "can_opacity": can_opacity,
            "can_visible": can_visible,
            "gl_left": gl_left,
            "gl_top": gl_top,
            "scale": 1,
            "gl_scale": gl_scale,
            "motion": "",
            "expression": ""
        };
        TYRANO.kag.stat.f.live2d_models[model_id] = live2d_model;
        MODEL_INFO = resources["ModelJson"].data.FileReferences;
        Live2Dcan[model_id] = new Live2Dtyrano(app, loader, MODEL_INFO, model_id);
        Live2Dcan[model_id].alphaChange(can_opacity);
        Live2Dcan[model_id].visible = can_visible;
        Live2Dno++;
        if (typeof cb == "function") {
            cb();
        }
    });
}
function live2d_show(model_id, time, left, top, scale, cb) {
    if (left === void 0) { left = 0; }
    if (top === void 0) { top = 0; }
    if (scale === void 0) { scale = 1.0; }
    if (left != 0 || top != 0) {
        Live2Dcan[model_id].transChange(model_id, left, top, "0");
    }
    Live2Dcan[model_id].scaleChange(scale, scale, "0");
    Live2Dcan[model_id].rotateChange(model_id);
    Live2Dcan[model_id].transChange(model_id, left, top, "0");
    if (Live2Dcan[model_id].check_delete == 1) {
        Live2Dcan[model_id].check_delete = 0;
    }
    setTimeout(function (model_id) {
        Live2Dcan[model_id].visible = true;
        Live2Dcan[model_id].alphaChange(1.0, time, cb);
    }, 100, model_id);
    TYRANO.kag.stat.f.live2d_models[model_id]["can_opacity"] = 1;
    TYRANO.kag.stat.f.live2d_models[model_id]["can_visible"] = true;
    TYRANO.kag.stat.f.live2d_models[model_id]["can_left"] = left;
    TYRANO.kag.stat.f.live2d_models[model_id]["can_top"] = top;
    TYRANO.kag.stat.f.live2d_models[model_id]["scale"] = scale;
}
function live2d_hide(model_id, time, cb) {
    setTimeout(function (model_id) {
        Live2Dcan[model_id].visible = true;
        Live2Dcan[model_id].alphaChange(0.0, time, cb);
        Live2Dcan[model_id].check_delete = 1;
    }, 100, model_id);
    TYRANO.kag.stat.f.live2d_models[model_id]["can_opacity"] = 0;
    TYRANO.kag.stat.f.live2d_models[model_id]["can_visible"] = false;
}
function live2d_opacity(model_id, opacity, time) {
    setTimeout("Live2Dcanvas['" + model_id + "'].alphaChange(" + opacity + ");", time);
    TYRANO.kag.stat.f.live2d_models[model_id]["opacity"] = opacity;
}
function live2d_color(model_id, red, green, blue) {
    Live2Dcan[model_id].colorChange(red, green, blue);
    TYRANO.kag.stat.f.live2d_models[model_id]["color_red"] = red;
    TYRANO.kag.stat.f.live2d_models[model_id]["color_green"] = green;
    TYRANO.kag.stat.f.live2d_models[model_id]["color_blue"] = blue;
}
function live2d_delete(model_id, parent_id) {
    Live2Dcan[model_id].alphaChange(0.0);
    Live2Dcan[model_id].check_delete = 2;
    setTimeout("live2d_Canvas_delete('" + model_id + "','" + parent_id + "');", 3000);
    delete TYRANO.kag.stat.f.live2d_models[model_id];
}
function live2d_Canvas_delete(model_id, parent_id) {
    Live2Dcan[model_id].destroy();
    $("#Live2D_" + model_id).remove();
    Live2Dcan[model_id] = null;
}
//# sourceMappingURL=Live2Dinit.js.map