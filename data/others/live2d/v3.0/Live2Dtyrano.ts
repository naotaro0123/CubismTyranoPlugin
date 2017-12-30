class Live2Dtyrano {
    private _app : PIXI.Application;
    private _modelInfo : any;
    private _moc : any;
    private _modelbuilder : LIVE2DCUBISMPIXI.ModelBuilder;
    private _animations : LIVE2DCUBISMFRAMEWORK.Animation[];
    private _model : LIVE2DCUBISMPIXI.Model;
    private _modelId : string;
    private _loader : PIXI.loaders.Loader;
    private _filePath : string;

    constructor(app : PIXI.Application, loader : PIXI.loaders.Loader, modelInfo : any, modelId : string){
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
            this.addChildren();
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
    }

    addChildren(){
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

    async tick(){
        // Set up ticker.
        await this._app.ticker.add((deltaTime) => {
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
        this._app.view.style.width = `${width}px`;
        this._app.view.style.height = `${height}px`;
        this._app.renderer.resize(width, height);
        // Resize model.
        this._model.position = new PIXI.Point(CANVAS_INFO.x, CANVAS_INFO.y);
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
