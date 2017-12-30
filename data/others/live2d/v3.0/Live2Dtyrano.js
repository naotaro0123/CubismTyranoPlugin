var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
            _this.addChildren();
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
    };
    Live2Dtyrano.prototype.addChildren = function () {
        this._app.stage.addChild(this._model);
        this._app.stage.addChild(this._model.masks);
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._app.ticker.add(function (deltaTime) {
                            _this._model.update(deltaTime);
                            _this._model.masks.update(_this._app.renderer);
                        })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
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
        this._model.masks.resize(this._app.view.width, this._app.view.height);
    };
    Live2Dtyrano.prototype.destroy = function () {
        this.stopAnimation();
        this._app.ticker.stop();
        this._loader.reset();
        this._app.destroy();
    };
    return Live2Dtyrano;
}());
//# sourceMappingURL=Live2Dtyrano.js.map