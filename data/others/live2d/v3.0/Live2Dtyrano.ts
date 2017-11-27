// Canvas
const CANVAS_INFO : any = {
    "id" : "Live2D_",
    "name" : "unitychan",
    "width" : 500,
    "height" : 500,
    "x" : 250,
    "y" : 250,
    "scaleX" : 400,
    "scaleY" : 400,
    "transparent": true,
};

let MODEL_INFO : any;
let Live2Dglno : number = 0;
let Live2Dcanvas : any = [];


class Live2Dtyrano{
    private _app : PIXI.Application;
    private _modelInfo : any;
    private _moc : any;
    private _modelbuilder : LIVE2DCUBISMPIXI.ModelBuilder;
    private _animations : LIVE2DCUBISMFRAMEWORK.Animation[];
    private _model : LIVE2DCUBISMPIXI.Model;
    private _modelId : number;
    private _loader : PIXI.loaders.Loader;
    private _filePath : string;

    constructor(app : PIXI.Application, loader : PIXI.loaders.Loader, modelInfo : any, modelId : number){
        this._app = app;
        this._loader = loader;
        this._modelInfo = modelInfo;
        this._modelId = modelId;
        this.init();
    }
    init(){
        this.loadMoc();
        this.loadTextures();
        this.loadMotions();
        this.loadPhysics();
        PIXI.loader.load((loader: PIXI.loaders.Loader, resources: PIXI.loaders.ResourceDictionary) => {
            this.loadResources(resources);
            this.loadAnimations(resources);
            this.playAnimation(0);
            this.resize();
            window.onresize = this.resize;
            this.tick();
        });
    }
    loadMoc(){
        PIXI.loader.add("Moc", LIVE2D_MODEL[this._modelId].filepath + this._modelInfo.Moc,
            { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER });
    }
    loadTextures(){
        for(var i = 0; i < this._modelInfo.Textures.length; i++)
        {
            PIXI.loader.add(`Texture${i}`, LIVE2D_MODEL[this._modelId].filepath + this._modelInfo.Textures[i]);
        }
    }
    loadMotions(){
        if(this._modelInfo.Motions !== void 0){
            for(var i = 0; i < this._modelInfo.Motions.length; i++)
            {
                PIXI.loader.add(`Motion${i}`, LIVE2D_MODEL[this._modelId].filepath + this._modelInfo.Motions[i],
                                { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });
            }
        }
    }
    loadPhysics(){
        if(this._modelInfo.Physics !== void 0){
            PIXI.loader.add("Physics", LIVE2D_MODEL[this._modelId].filepath + this._modelInfo.Physics,
            { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });
        }
    }
    loadResources(_resources : PIXI.loaders.ResourceDictionary){
        // Load moc.
        this._moc = LIVE2DCUBISMCORE.Moc.fromArrayBuffer(_resources["Moc"].data);
        this._modelbuilder = new LIVE2DCUBISMPIXI.ModelBuilder();
        this._modelbuilder.setMoc(this._moc)
                            .setTimeScale(1);
        // Texture
        for(var i =0; i < this._modelInfo.Textures.length; i++)
        {
            this._modelbuilder.addTexture(i, _resources[`Texture${i}`].texture);
        }
        // Motion
        this._modelbuilder.addAnimatorLayer("Base",
            LIVE2DCUBISMFRAMEWORK.BuiltinAnimationBlenders.OVERRIDE, 1);
        // PhySics
        if(_resources["Physics"] !== void 0){
            this._modelbuilder.setPhysics3Json(_resources["Physics"].data);
        }
        this._model = this._modelbuilder.build();
        // Add model to stage.
        this._app.stage.addChild(this._model);
        this._app.stage.addChild(this._model.masks);
    }
    loadAnimations(_resources : PIXI.loaders.ResourceDictionary){
        // Load animation.
        this._animations = [];
        if(this._modelInfo.Motions !== void 0){
            for(var i = 0; i < this._modelInfo.Motions.length; i++)
            {
                this._animations[i] =
                    LIVE2DCUBISMFRAMEWORK.Animation.fromMotion3Json(_resources[`Motion${i}`].data);
            }
        }
    }
    playAnimation(i : number){
        // Play animation.
        this._model.animator.getLayer("Base").play(this._animations[i]);
    }
    stopAnimation(){
        this._model.animator.getLayer("Base").stop();
    }
    setLoop(loop : boolean){
        this._model.animator.getLayer("Base").currentAnimation.loop = loop;
    }
    tick(){
        // Set up ticker.
        this._app.ticker.add((deltaTime) => {
            this._model.update(deltaTime);
            this._model.masks.update(this._app.renderer);
        });
    }
    setTickSpeed(speed : number = 1){
        this._app.ticker.speed = speed;
    }
    showTickFPS(){
        console.log(this._app.ticker.FPS);
    }
    resize(){
        let width = CANVAS_INFO.width;
        let height = CANVAS_INFO.height;
        // Resize app.
        this._app.view.style.width = width + "px";
        this._app.view.style.height = height + "px";
        this._app.renderer.resize(width, height);
        // Resize model.
        // model.position = new PIXI.Point((width * 0.5), (height * 0.5));
        this._model.position = new PIXI.Point(CANVAS_INFO.x, CANVAS_INFO.y);
        // model.scale = new PIXI.Point((model.position.x * 0.8), (model.position.x * 0.8));
        this._model.scale = new PIXI.Point(CANVAS_INFO.scaleX, CANVAS_INFO.scaleY);
        // Resize mask texture.
        this._model.masks.resize(this._app.view.width, this._app.view.height);
    }
    destroy(){
        this.stopAnimation();
        this._app.ticker.stop();
        this._loader.reset();
        this._app.destroy();

    }
}


function live2d_new(name : string){
    // Create app.
    let app: PIXI.Application = new PIXI.Application(CANVAS_INFO.width, CANVAS_INFO.height,
                                {transparent : CANVAS_INFO.transparent});

    PIXI.loader.add("ModelJson", LIVE2D_MODEL[name].filepath + LIVE2D_MODEL[name].modeljson,
        { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });

        PIXI.loader.load((loader: PIXI.loaders.Loader, resources: PIXI.loaders.ResourceDictionary) => {
            var can  = resources["ModelJson"].data;

            MODEL_INFO = resources["ModelJson"].data.FileReferences;
            Live2Dcanvas[Live2Dglno] = new Live2Dtyrano(app, loader, MODEL_INFO, name);
            Live2Dglno++;

            app.view.id = CANVAS_INFO.id + name;
            app.view.style.zIndex = 12;
            app.view.style.position = 'absolute';

            //レイヤー配下に追加するように実装
            var target_layer = TYRANO.kag.layer.getLayer("0","fore");
            target_layer.show();
            target_layer.append($(app.view));
        });
}

