var CANVAS_INFO = {
    "id": "Live2D_",
    "name": "koharu",
    "width": 500,
    "height": 500,
    "x": 250,
    "y": 250,
    "scaleX": 400,
    "scaleY": 400,
    "transparent": true,
};
var MODEL_INFO;
var Live2Dglno = 0;
var Live2Dcanvas = [];
var Live2Dtyrano = (function () {
    function Live2Dtyrano(app, loader, modelInfo, modelId) {
        this._app = app;
        this._loader = loader;
        this._modelInfo = modelInfo;
        this._modelId = modelId;
        this.init();
    }
    Live2Dtyrano.prototype.init = function () {
        var _this = this;
        this.loadMoc();
        this.loadTextures();
        this.loadMotions();
        this.loadPhysics();
        PIXI.loader.load(function (loader, resources) {
            _this.loadResources(resources);
            _this.loadAnimations(resources);
            _this.playAnimation(0);
            _this.resize();
            window.onresize = _this.resize;
            _this.tick();
        });
    };
    Live2Dtyrano.prototype.loadMoc = function () {
        PIXI.loader.add("Moc", LIVE2D_MODEL[this._modelId].filepath + this._modelInfo.Moc, { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER });
    };
    Live2Dtyrano.prototype.loadTextures = function () {
        for (var i = 0; i < this._modelInfo.Textures.length; i++) {
            PIXI.loader.add("Texture" + i, LIVE2D_MODEL[this._modelId].filepath + this._modelInfo.Textures[i]);
        }
    };
    Live2Dtyrano.prototype.loadMotions = function () {
        if (this._modelInfo.Motions !== void 0) {
            for (var i = 0; i < this._modelInfo.Motions.length; i++) {
                PIXI.loader.add("Motion" + i, LIVE2D_MODEL[this._modelId].filepath + this._modelInfo.Motions[i], { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });
            }
        }
    };
    Live2Dtyrano.prototype.loadPhysics = function () {
        if (this._modelInfo.Physics !== void 0) {
            PIXI.loader.add("Physics", LIVE2D_MODEL[this._modelId].filepath + this._modelInfo.Physics, { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });
        }
    };
    Live2Dtyrano.prototype.loadResources = function (_resources) {
        this._moc = LIVE2DCUBISMCORE.Moc.fromArrayBuffer(_resources["Moc"].data);
        this._modelbuilder = new LIVE2DCUBISMPIXI.ModelBuilder();
        this._modelbuilder.setMoc(this._moc)
            .setTimeScale(1);
        for (var i = 0; i < this._modelInfo.Textures.length; i++) {
            this._modelbuilder.addTexture(i, _resources["Texture" + i].texture);
        }
        this._modelbuilder.addAnimatorLayer("Base", LIVE2DCUBISMFRAMEWORK.BuiltinAnimationBlenders.OVERRIDE, 1);
        if (_resources["Physics"] !== void 0) {
            this._modelbuilder.setPhysics3Json(_resources["Physics"].data);
        }
        this._model = this._modelbuilder.build();
        this._app.stage.addChild(this._model);
    };
    Live2Dtyrano.prototype.loadAnimations = function (_resources) {
        this._animations = [];
        if (this._modelInfo.Motions !== void 0) {
            for (var i = 0; i < this._modelInfo.Motions.length; i++) {
                this._animations[i] =
                    LIVE2DCUBISMFRAMEWORK.Animation.fromMotion3Json(_resources["Motion" + i].data);
            }
        }
    };
    Live2Dtyrano.prototype.playAnimation = function (i) {
        this._model.animator.getLayer("Base").play(this._animations[i]);
    };
    Live2Dtyrano.prototype.stopAnimation = function () {
        this._model.animator.getLayer("Base").stop();
    };
    Live2Dtyrano.prototype.setLoop = function (loop) {
        this._model.animator.getLayer("Base").currentAnimation.loop = loop;
    };
    Live2Dtyrano.prototype.tick = function () {
        var _this = this;
        this._app.ticker.add(function (deltaTime) {
            _this._model.update(deltaTime);
        });
    };
    Live2Dtyrano.prototype.setTickSpeed = function (speed) {
        if (speed === void 0) { speed = 1; }
        this._app.ticker.speed = speed;
    };
    Live2Dtyrano.prototype.showTickFPS = function () {
        console.log(this._app.ticker.FPS);
    };
    Live2Dtyrano.prototype.resize = function () {
        var width = CANVAS_INFO.width;
        var height = CANVAS_INFO.height;
        this._app.view.style.width = width + "px";
        this._app.view.style.height = height + "px";
        this._app.renderer.resize(width, height);
        this._model.position = new PIXI.Point(CANVAS_INFO.x, CANVAS_INFO.y);
        this._model.scale = new PIXI.Point(CANVAS_INFO.scaleX, CANVAS_INFO.scaleY);
    };
    Live2Dtyrano.prototype.destroy = function () {
        this.stopAnimation();
        this._app.ticker.stop();
        this._loader.reset();
        this._app.destroy();
    };
    return Live2Dtyrano;
}());
function live2d_new(name) {
    var app = new PIXI.Application(CANVAS_INFO.width, CANVAS_INFO.height, { transparent: CANVAS_INFO.transparent });
    PIXI.loader.add("ModelJson", LIVE2D_MODEL[name].filepath + LIVE2D_MODEL[name].modeljson, { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });
    PIXI.loader.load(function (loader, resources) {
        var can = resources["ModelJson"].data;
        MODEL_INFO = resources["ModelJson"].data.FileReferences;
        Live2Dcanvas[Live2Dglno] = new Live2Dtyrano(app, loader, MODEL_INFO, name);
        Live2Dglno++;
        app.view.id = CANVAS_INFO.id + name;
        app.view.style.zIndex = 12;
        app.view.style.position = 'absolute';
        var target_layer = TYRANO.kag.layer.getLayer("0", "fore");
        target_layer.show();
        target_layer.append($(app.view));
    });
}
//# sourceMappingURL=Live2Dtyrano.js.map