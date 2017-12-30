// Canvas
const CANVAS_INFO : any = {
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

let MODEL_INFO: any;
let Live2Dno: number = 0;
let Live2Dcan: any = [];


function live2d_new(model_id: string, can_left: number = 0, can_top: number = 0,
    can_width: string = TYRANO.kag.config.scWidth, can_height: string = TYRANO.kag.config.scHeight,
    can_zindex: string = "12", can_opacity: string = "0.0", can_visible: boolean = false,
    gl_left: number = 0.0, gl_top: number = 0.0, gl_scale: number = 1.0, parent_id: string, cb: any
){
    if($("#Live2D_" + model_id).get(0)){
        $("#Live2D_" + model_id).remove();
    }

    // Create app.
    let app: PIXI.Application = new PIXI.Application(CANVAS_INFO.width, CANVAS_INFO.height,
                                {transparent : CANVAS_INFO.transparent});

    PIXI.loader.add("ModelJson", LIVE2D_MODEL[model_id].filepath + LIVE2D_MODEL[model_id].modeljson,
        { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });

    PIXI.loader.load((loader: PIXI.loaders.Loader, resources: PIXI.loaders.ResourceDictionary) => {
        let can  = resources["ModelJson"].data;

        app.view.id = CANVAS_INFO.id + model_id;
        app.view.style.left = `${can_left}px`;
        app.view.style.top = `${can_top}px`;
        app.view.style.width = can_width;
        app.view.style.height = can_height;
        app.view.style.zIndex = can_zindex;
        app.view.style.opacity = can_opacity;
        app.view.style.position = 'absolute';

        //レイヤー配下に追加するように実装
        let target_layer = TYRANO.kag.layer.getLayer("0","fore");
        target_layer.show();
        target_layer.append($(app.view));

        //キャラクター情報を登録する
        const live2d_model = {
            "model_id":model_id,       /*Live2DモデルID*/
            "can_left":can_left,       /*CanvasのX位置*/
            "can_top":can_top,         /*CanvasのY位置*/
            "can_width":can_width,     /*Canvasの横幅*/
            "can_height":can_height,   /*Canvasの高さ*/
            "can_zindex":can_zindex,   /*Canvasの奥行き*/
            "can_opacity":can_opacity, /*Canvasの透明度*/
            "can_visible":can_visible, /*Canvasの表示制御*/
            "gl_left":gl_left,         /*Canvas内のLive2DモデルのX位置*/
            "gl_top":gl_top,           /*Canvas内のLive2DモデルのY位置*/
            "scale":1,                 /*スケール情報。chara_newの時は1でおｋ*/
            "gl_scale":gl_scale,       /*Canvas内のLive2Dモデルのスケール*/
            // "paraent_id":parent_id,
            "motion":"",               /*モーション*/
            "expression":""            /*表情モーション*/
        };

        TYRANO.kag.stat.f.live2d_models[model_id] = live2d_model;

        MODEL_INFO = resources["ModelJson"].data.FileReferences;
        Live2Dcan[model_id] = new Live2Dtyrano(app, loader, MODEL_INFO, model_id);
        Live2Dcan[model_id].alphaChange(can_opacity);
        Live2Dcan[model_id].visible = can_visible;
        Live2Dno++;

        if(typeof cb=="function"){
            cb();
        }
    });
}


function live2d_show(model_id: string, time: any, left: number = 0,
    top: number = 0, scale: number = 1.0, cb: any)
{
    if(left!=0 || top!=0){
        Live2Dcan[model_id].transChange(model_id,left,top,"0");
    }
    Live2Dcan[model_id].scaleChange(scale,scale,"0");
    Live2Dcan[model_id].rotateChange(model_id);
    Live2Dcan[model_id].transChange(model_id,left,top,"0");
    //非表示からの復帰の場合、再度アニメーション
    if(Live2Dcan[model_id].check_delete == 1){
        Live2Dcan[model_id].check_delete = 0;
    }
    setTimeout((model_id: any) => {
        Live2Dcan[model_id].visible = true;
        Live2Dcan[model_id].alphaChange(1.0,time,cb);
    }, 100,model_id);

    TYRANO.kag.stat.f.live2d_models[model_id]["can_opacity"] = 1;
    TYRANO.kag.stat.f.live2d_models[model_id]["can_visible"] = true;
    TYRANO.kag.stat.f.live2d_models[model_id]["can_left"] = left;
    TYRANO.kag.stat.f.live2d_models[model_id]["can_top"] = top;
    TYRANO.kag.stat.f.live2d_models[model_id]["scale"] = scale;
}


function live2d_hide(model_id: string, time: any, cb: any)
{
    // キャラを透明からゆっくり表示する
    setTimeout(function(model_id: any){
        Live2Dcan[model_id].visible = true;
        Live2Dcan[model_id].alphaChange(0.0,time,cb);
        Live2Dcan[model_id].check_delete = 1;

    }, 100,model_id);

    TYRANO.kag.stat.f.live2d_models[model_id]["can_opacity"] = 0;
    TYRANO.kag.stat.f.live2d_models[model_id]["can_visible"] = false;
}


function live2d_opacity(model_id: string, opacity: string, time: any)
{
  // キャラを透明度をゆっくり切り替える
  setTimeout("Live2Dcanvas['" + model_id + "'].alphaChange(" + opacity + ");", time);
  TYRANO.kag.stat.f.live2d_models[model_id]["opacity"] = opacity;
}


function live2d_color(model_id: string, red: any, green: any, blue: any)
{
    // キャラを透明にしていく
    Live2Dcan[model_id].colorChange(red, green, blue);
    TYRANO.kag.stat.f.live2d_models[model_id]["color_red"]   = red;
    TYRANO.kag.stat.f.live2d_models[model_id]["color_green"] = green;
    TYRANO.kag.stat.f.live2d_models[model_id]["color_blue"]  = blue;
}


function live2d_delete(model_id: string, parent_id: string)
{
        // キャラを透明にしていく
        Live2Dcan[model_id].alphaChange(0.0);
        // キャンバスを削除する
        Live2Dcan[model_id].check_delete = 2;
        setTimeout("live2d_Canvas_delete('" + model_id + "','" + parent_id + "');",3000);
        delete TYRANO.kag.stat.f.live2d_models[model_id];
}


function live2d_Canvas_delete(model_id: string, parent_id: string, )
{
    Live2Dcan[model_id].destroy();
    $("#Live2D_"+model_id).remove();
    Live2Dcan[model_id] = null;
}