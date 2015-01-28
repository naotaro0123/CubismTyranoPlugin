var Live2Dcanvas = [];      // canvas

(function(window){

    // Live2Dの初期化
    Live2D.init();

    /****************************************
    * Live2Dのtyrano対応クラス
    ****************************************/
    var Live2Dtyrano = function( canvasid   /*canvasid*/,
                                 modelpath  /*Live2Dモデルパス定義*/,
                                 pointX     /*Live2Dモデルの表示位置X*/,
                                 pointY     /*Live2Dモデルの表示位置Y*/,
                                 modelscale /*Live2Dモデルの表示サイズ*/
                                 ) {
        // optional
        if(pointX == null)pointX = 0.0;
        if(pointY == null)pointY = 0.0;
        if(modelscale == null)modelscale = 2.0;
        // Live2Dモデルのインスタンス
        this.live2DModel = null;
        // アニメーションを停止するためのID
        this.requestID = null;
        // モデルのロードが完了したら true
        this.loadLive2DCompleted = false;
        // モデルの初期化が完了したら true
        this.initLive2DCompleted = false;
        // WebGL Image型オブジェクトの配列
        this.loadedImages = [];
        // モーションファイル
        this.motions = [];
        this.motionMgr = null;
        this.motionnm = 0;
        this.motionflg = false;
        // サウンドファイル
        this.sounds = [];
        this.soundnum = 0;
        this.beforesound = 0;
        // Canvasパラメーター
        this.trans = '';    // 移動位置
        this.transX = 0;    // 揺らす用
        this.rotate = '';   // 回転位置
        this.degs = 0;      // 回転角度
        this.scale = '';    // 拡大・縮小
        // Live2D モデル設定。
        this.modelDef = modelpath;
        // Live2DモデルOpenGL表示サイズ
        this.modelscale = modelscale;
        // Live2DモデルOpenGL表示位置X
        this.pointX = pointX;
        // Live2DモデルOpenGL表示位置Y
        this.pointY = pointY;
        // canvasオブジェクトを取得
        this.canvas = document.getElementById(canvasid);
        // コンテキストを失ったとき
        this.canvas.addEventListener("webglcontextlost", function(e) {
            this.myerror("context lost");
            this.loadLive2DCompleted = false;
            this.initLive2DCompleted = false;

            var cancelAnimationFrame =
                window.cancelAnimationFrame ||
                window.mozCancelAnimationFrame;
            cancelAnimationFrame(requestID); //アニメーションを停止

            e.preventDefault();
        }, false);

        // コンテキストが復元されたとき
        this.canvas.addEventListener("webglcontextrestored" , function(e){
            this.myerror("webglcontext restored");
            this.initLoop(this.canvas);
        }, false);

        // 初期化とループ処理
        this.initLoop(this.canvas);
    };


    /**
    * WebGLコンテキストを取得・初期化。
    * Live2Dの初期化、描画ループを開始。
    */
    Live2Dtyrano.prototype.initLoop = function( canvas  /*HTML5 canvasオブジェクト*/) {
        // WebGLのコンテキストを取得する
        var gl = this.getWebGLContext(canvas);
        if (!gl) {
            console.log("Failed to create WebGL context.");
            return;
        }
        // 描画エリアを白でクリア
        gl.clearColor( 0.0 , 0.0 , 0.0 , 0.0 );
        // コールバック用にthisを別変数に保持
        var that = this;
        // mocファイルからLive2Dモデルのインスタンスを生成
        that.loadBytes(that.modelDef.model, function(buf){
            // Live2Dモデルのロードと初期化
            that.live2DModel = Live2DModelWebGL.loadModel(buf);
        });
        // テクスチャの読み込み
        var loadCount = 0;
        for(var i = 0; i < that.modelDef.textures.length; i++){
            (function ( tno ){// 即時関数で i の値を tno に固定する（onerror用)
                that.loadedImages[tno] = new Image();
                that.loadedImages[tno].src = that.modelDef.textures[tno];
                that.loadedImages[tno].onload = function(){
                    if((++loadCount) == that.modelDef.textures.length) {
                        that.loadLive2DCompleted = true;//全て読み終わった
                    }
                }
                that.loadedImages[tno].onerror = function() {
                    console.log("Failed to load image : " + that.modelDef.textures[tno]);
                }
            })( i );
        }
        // モーションのロード
        for(var j = 0; j < that.modelDef.motions.length; j++){
            that.loadBytes(that.modelDef.motions[j].file, function(buf){
                that.motions.push(new Live2DMotion.loadMotion(buf));
            });
        }
        // モーションマネージャクラスの生成
        that.motionMgr = new L2DMotionManager();
        // サウンドのロード
        for(var k = 0; k < that.modelDef.motions.length; k++){
            if(that.modelDef.motions[k].sound == null){
                that.sounds.push("");
            }else{
                that.sounds.push(new Sound(that.modelDef.motions[k].sound));
            }
        }
        //------------ 描画ループ ------------
        (function tick() {
            that.draw(gl,that); // 1回分描画

            var requestAnimationFrame =
                window.requestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.msRequestAnimationFrame;
            // 一定時間後に自身を呼び出す
            that.requestID = requestAnimationFrame( tick , that.canvas );
        })();
    };


    /**
    * Live2Dの描画処理
    */
    Live2Dtyrano.prototype.draw = function( gl  /*WebGLコンテキスト*/,
                                            that/*this代入した変数*/){
        // Canvasをクリアする
        gl.clear(gl.COLOR_BUFFER_BIT);
        // Live2D初期化
        if( ! that.live2DModel || !  that.loadLive2DCompleted )
            return; //ロードが完了していないので何もしないで返る

        // ロード完了後に初回のみ初期化する
        if( !  that.initLive2DCompleted ){
            that.initLive2DCompleted = true;

            // 画像からWebGLテクスチャを生成し、モデルに登録
            for( var i = 0; i < that.loadedImages.length; i++ ){
                //Image型オブジェクトからテクスチャを生成
                var texName = that.createTexture(gl, that.loadedImages[i]);
                //モデルにテクスチャをセット
                that.live2DModel.setTexture(i, texName);
            }
            // テクスチャの元画像の参照をクリア
            that.loadedImages = null;
            // OpenGLのコンテキストをセット
            that.live2DModel.setGL(gl);
            // 表示位置を指定するための行列を定義する
            var s = that.modelscale / that.live2DModel.getCanvasWidth();
            var matrix4x4 = [
                s,  0,  0,  0,
                0, -s,  0,  0,
                0,  0,  1,  0,
                -that.modelscale/2+that.pointX, that.modelscale/2+that.pointY, 0, 1
            ];
            that.live2DModel.setMatrix(matrix4x4);
        }
        // モーション再生ボタン押下された場合
        if(that.motionflg == true && that.motionMgr.getCurrentPriority() == 0){
            // アイドルモーションより優先度を上げたものを再生する
            that.motionMgr.startMotion(that.motions[that.motionnm],1);
            that.motionflg = false;
            // 音声ファイルが日もづくいていれば再生する
            if(that.sounds[that.motionnm]){
                // 前回のサウンドがあれば停止する
                if(that.sounds[that.beforesound] != ""){
                    that.sounds[that.beforesound].stop();
                }
                // サウンドを鳴らす
                that.sounds[that.motionnm].play();
                // 途中で停止するように格納しておく
                that.beforesound = that.motionnm;
            }
        }
        // モーションが終了していたら1つ目のファイルアイドル再生
        if(that.motionMgr.isFinished() && that.motionnm != null){
            //var rand = Math.floor(Math.random()*2);
            var rand = 0;
            that.motionMgr.startMotion(that.motions[rand], 0);
        }
        // モーション指定されてない場合は動かない
        if(that.motionnm != null){
            // モーションの更新
            that.motionMgr.updateParam(that.live2DModel);
        }
        // Live2Dモデルを更新して描画
        that.live2DModel.update(); // 現在のパラメータに合わせて頂点等を計算
        that.live2DModel.draw();    // 描画
    };


    /**
    * WebGLのコンテキストを取得する
    */
    Live2Dtyrano.prototype.getWebGLContext = function(canvas/*HTML5 canvasオブジェクト*/){
        var NAMES = [ "webgl" , "experimental-webgl" , "webkit-3d" , "moz-webgl"];
        var param = {
            alpha : true,
        };

        for( var i = 0; i < NAMES.length; i++ ){
            try{
                var ctx = canvas.getContext( NAMES[i], param );
                if( ctx ) return ctx;
            }
            catch(e){}
        }
        return null;
    };


    /**
    * Image型オブジェクトからテクスチャを生成
    */
    Live2Dtyrano.prototype.createTexture = function( gl     /*WebGLコンテキスト*/,
                                                     image  /*WebGL Image*/){
        var texture = gl.createTexture(); //テクスチャオブジェクトを作成する
        if ( !texture ){
            console.log("Failed to generate gl texture name.");
            return -1;
        }

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);    //imageを上下反転
        gl.activeTexture( gl.TEXTURE0 );
        gl.bindTexture( gl.TEXTURE_2D , texture );
        gl.texImage2D( gl.TEXTURE_2D , 0 , gl.RGBA , gl.RGBA , gl.UNSIGNED_BYTE , image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);

        return texture;
    };


    /**
    * ファイルをバイト配列としてロードする
    */
    Live2Dtyrano.prototype.loadBytes = function(path , callback){
        var request = new XMLHttpRequest();
        request.open("GET", path , true);
        request.responseType = "arraybuffer";
        request.onload = function(){
            switch( request.status ){
            case 200:
                callback( request.response );
                break;
            default:
                console.log( "Failed to load (" + request.status + ") : " + path );
                break;
            }
        }
        request.send(null);
        return request;
    };


    /**
    * モーション切り替え
    */
    Live2Dtyrano.prototype.motionChange = function(num/*モーション番号*/){
        this.motionnm = num;
        this.motionflg = true;
    };


    /**
    * キャラクターの移動
    */
    Live2Dtyrano.prototype.transChange = function( left     /*CanvasのX位置*/,
                                                   top      /*CanvasのY位置*/,
                                                   time     /*アニメーション時間*/){
        // optional
        if(left == null) left = 0;
        if(top == null) top = 0;
        if(time == null) time = "2.0s";
        this.trans = "translate(" + left + "px ," + top + "px)";
        this.transX = left;
        this.canvas.style.webkitTransform = this.trans + this.rotate + this.scale;
        this.canvas.style.webkitTransitionDuration = time;
        this.canvas.style.webkitTransitionTimingFunction = "ease-out";
    };


    /**
    * キャラクターの回転
    */
    Live2Dtyrano.prototype.rotateChange= function( deg  /*Canvasの回転角度*/,
                                                   time /*アニメーション時間*/){
        // optional
        if(deg == null){
            this.degs = 0;
        }else{
            this.degs += deg;
        }
        if(time == null) time = "2.0s";
        this.rotate = "rotate(" + this.degs + "deg)";
        this.canvas.style.webkitTransform = this.trans + this.rotate + this.scale;
        this.canvas.style.webkitTransitionDuration = time;
        this.canvas.style.webkitTransitionTimingFunction = "ease-out";
    };


    /**
    * キャラクターの拡大・縮小
    */
    Live2Dtyrano.prototype.scaleChange = function( scaleX   /*CanvasのXスケール*/,
                                                   scaleY   /*CanvasのYスケール*/,
                                                   time     /*アニメーション時間*/){
        // optional
        if(scaleX == null) scaleX = 0;
        if(scaleY == null) scaleY = 0;
        if(time == null) time = "1.0s";
        this.scale = "scale(" + scaleX + "," + scaleY + ")";
        this.canvas.style.webkitTransform = this.trans + this.rotate + this.scale;
        this.canvas.style.webkitTransitionDuration = time;
        this.canvas.style.webkitTransitionTimingFunction = "ease-out";
    };


    /**
    * キャラクターを揺らす
    */
    Live2Dtyrano.prototype.vibration = function(){
        // stylesheetオブジェクトの最初のものを取得する
        var styleSheet = document.styleSheets[0];
        var targetRuleIndex = styleSheet.cssRules.length;
        var puru1 = this.transX + 10;
        var puru2 = this.transX - 10;
        // アニメーション
        var keyframes = "@-webkit-keyframes anim { \n" +
            "25% {-webkit-transform:translateX(" + puru1 + "px);} \n" +
            "50% {-webkit-transform:translateX(" + puru2 + "px);} \n" +
            "75% {-webkit-transform:translateX(" + puru1 + "px);} \n" +
            "}";
        styleSheet.insertRule(keyframes, targetRuleIndex);
        this.canvas.style.webkitAnimation = "anim 0.2s ease-out 0.0s 3";
        // アニメーション終了後
        this.canvas.addEventListener('webkitAnimationEnd', function(){
            // ルールが追加済みなら削除する
            this.style.webkitAnimation = 'none';
            this.style['-webkit-animation'] = '';
        });
    };


    /**
    * キャラクターの透明度
    */
    Live2Dtyrano.prototype.alphaChange = function( opacity  /*Canvasの透明度*/,
                                                   time     /*アニメーション時間*/){
        // optional
        if(opacity == null) opacity = 1.0;
        if(time == null) time = "1.0s";
        this.canvas.style.opacity = opacity;
        this.canvas.style.webkitTransitionDuration = time;
        this.canvas.style.webkitTransitionTimingFunction = "ease-out";
    };



    /****************************************
    * サウンドクラス
    ****************************************/
    var Sound = function(path   /*音声ファイルパス*/) {
        this.snd = document.createElement("audio");
        this.snd.src = path;
    };

    /**
    * 音声再生
    */
    Sound.prototype.play = function() {
        this.snd.play();
    };

    /**
    * 音声停止
    */
    Sound.prototype.stop = function() {
        this.snd.pause();
        this.snd.currentTime = 0;
    };


    window.Live2Dtyrano = Live2Dtyrano;

}(window));



//----------------------------------------------------------------------//
//                     上記クラスを操作するファンクション                      //
//----------------------------------------------------------------------//
/**
* キャンバスとLive2Dモデル生成
*/
function live2d_new( model_def      /*Live2Dモデル定義*/,
                     model_id       /*Live2DモデルID*/,
                     can_left       /*CanvasのX位置*/,
                     can_top        /*CanvasのY位置*/,
                     can_width      /*Canvasの横幅*/,
                     can_height     /*Canvasの高さ*/,
                     can_zindex     /*Canvasの奥行き*/,
                     can_opacity    /*Canvasの透明度*/,
                     gl_left    /*Canvas内のLive2DモデルのX位置*/,
                     gl_top     /*Canvas内のLive2DモデルのY位置*/,
                     gl_scale   /*Canvas内のLive2Dモデルのスケール*/,
                     paraent_id /*親ID*/){

    // optional
    if(can_left == null)can_left = 100;
    if(can_top == null)can_top = 90;
    if(can_width == null)can_width = 400;
    if(can_height == null)can_height = 400;
    if(can_zindex == null)can_zindex = 12;
    if(can_opacity == null)can_opacity = 0.0;
    if(gl_left == null)gl_left = 0.0;
    if(gl_top == null)gl_top = 0.0;
    if(gl_scale == null)gl_scale = 2.0;

    var ele = document.createElement('canvas');
    ele.id = "Live2D_" + model_id;
    ele.style.left = can_left + 'px';
    ele.style.top = can_top + 'px';
    ele.width = can_width;
    ele.height = can_height;
    ele.style.zIndex = can_zindex;
    ele.style.opacity = can_opacity;
    ele.style.position = 'absolute';

    // tyranoスクリプト親配下に追加
    //document.getElementById(paraent_id).appendChild(ele);

    //レイヤー配下に追加するように実装
    var target_layer = TYRANO.kag.layer.getLayer("0","fore");
    target_layer.show();
    target_layer.append($(ele));

    //キャラクター情報を登録する
    var live2d_model = {
        "model_def":model_def,  /*Live2Dモデル定義*/
        "model_id":model_id,   /*Live2DモデルID*/
        "can_left":can_left,   /*CanvasのX位置*/
        "can_top":can_top,    /*CanvasのY位置*/
        "can_width":can_width,  /*Canvasの横幅*/
        "can_height":can_height, /*Canvasの高さ*/
        "can_zindex":can_zindex, /*Canvasの奥行き*/
        "can_opacity":can_opacity,
        "gl_left":gl_left,    /*Canvas内のLive2DモデルのX位置*/
        "gl_top":gl_top,     /*Canvas内のLive2DモデルのY位置*/
        "gl_scale":gl_scale,   /*Canvas内のLive2Dモデルのスケール*/
        "paraent_id":paraent_id
    };
    
    TYRANO.kag.stat.f.live2d_models[model_id] = live2d_model;
    Live2Dcanvas[model_id] = new Live2Dtyrano(ele.id, model_def, gl_left, gl_top, gl_scale);
    Live2Dcanvas[model_id].alphaChange(can_opacity);
}

/**
* Live2Dキャラの表示
*/
function live2d_show( model_id   /*Live2DモデルID*/,
                      time       /*切り替え時間*/){
    // キャラを透明からゆっくり表示する
    setTimeout("Live2Dcanvas['" + model_id + "'].alphaChange(1.0);", time);
    TYRANO.kag.stat.f.live2d_models[model_id]["can_opacity"] = 1;
}

/**
* Live2Dキャラの非表示
*/
function live2d_hide( model_id   /*Live2DモデルID*/,
                      time       /*切り替え時間*/){
    // キャラを透明からゆっくり表示する
    setTimeout("Live2Dcanvas['" + model_id + "'].alphaChange(0.0);", time);
    TYRANO.kag.stat.f.live2d_models[model_id]["can_opacity"] = 0;
}

/**
* Live2Dキャラの透明度
*/
function live2d_opacity( model_id   /*Live2DモデルID*/,
                         opacity    /*Canvasの透明度*/,
                         time       /*切り替え時間*/){
    // キャラを透明度をゆっくり切り替える
    setTimeout("Live2Dcanvas['" + model_id + "'].alphaChange(" + opacity + ");", time);
    TYRANO.kag.stat.f.live2d_models[model_id]["opacity"] = opacity;
}

/**
* Live2Dキャラの退場
*/
function live2d_delete(model_id     /*Live2DモデルID*/,
                       paraent_id   /*親ID*/){
    // キャラを透明にしていく
    Live2Dcanvas[model_id].alphaChange(0.0);
    // キャンバスを削除する
    setTimeout("live2d_Canvas_delete('" + model_id + "','" + paraent_id + "');",3000);
    
     delete TYRANO.kag.stat.f.live2d_models[model_id];
    
}

/**
* キャンバス削除
*/
function live2d_Canvas_delete(model_id      /*Live2Dモデル名*/,
                              paraent_id    /*親ID*/){
    var canvas_id = document.getElementById(Live2Dcanvas[model_id].canvas.id);
    document.getElementById(paraent_id).removeChild(canvas_id);
    $("#Live2D_"+model_id).remove();
    Live2Dcanvas[model_id] = null;
}
