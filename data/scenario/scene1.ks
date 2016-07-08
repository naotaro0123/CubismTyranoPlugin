;ティラノスクリプトサンプルゲーム

*start

[cm  ]
[clearfix]

[bg storage="room.jpg" time="100"]

;メニューボタンの表示
@showmenubutton

;メッセージウィンドウの設定
[position layer="message0" left=20 top=400 width=920 height=200 page=fore visible=true]

;文字が表示される領域を調整
[position layer=message0 page=fore margint="45" marginl="50" marginr="70" marginb="60"]


;メッセージウィンドウの表示
@layopt layer=message0 visible=true

;キャラクターの名前が表示される文字領域
[ptext name="chara_name_area" layer="message0" color="white" size=24 x=50 y=410]

;上記で定義した領域がキャラクターの名前表示であることを宣言（これがないと#の部分でエラーになります）
[chara_config ptext="chara_name_area"]

;Live2Dモデルの定義
; Live2Dモデルの生成（ハル）
[live2d_new name="haru" left=0 top=-60 glscale=1.5]
; Live2Dモデルの生成（イプシロン）
[live2d_new name="Epsilon" top=0 left=0 glscale=1.3]

; Live2Dモデルの表示（ハル）
[live2d_show name="haru"]
[cm]
#ハルちゃん
このゲームはLive2Dの動作サンプル集です[p]

#ハルちゃん
Live2Dを使う事で今までにないアニメーションを[r]する事ができます[p]
このサンプルではLive2Dの使い方を紹介するね[p]

最初にちょっと移動してみるね[p]
[live2d_trans name="haru" left=200 top=0]
[wait time=1500]
[live2d_trans name="haru" left=0 top=-50]
[wait time=1500]
[live2d_trans name="haru" left=0 top=10]
[live2d_trans name="haru" left=0 top=0]
[wait time=1500]


あとは回転したり拡大縮小もできるよ[p]
[live2d_rotate name="haru" rotate=360]
[wait time=2000]
[live2d_scale name="haru" scaleX=0.5 scaleY=0.5]
[live2d_rotate name="haru" rotate=-120]
[wait time=1000]
[live2d_rotate name="haru" rotate=-240]
[live2d_scale name="haru" scaleX=1.0 scaleY=1.0]
[wait time=1500]


透明度を調整したり[r]
[live2d_opacity name="haru" opacity="0.5" time="100"]
[wait time=2000]
[live2d_opacity name="haru" opacity="1.0" time="100"]
[wait time=500]


キャラクターを揺らす事もできるよ♪[p]
[live2d_shake name="haru"]
[wait time=1500]


さらにモーションや音声の再生もできるよ[p]
[live2d_motion name="haru" filenm="tapBody_00.mtn"]
[wait time=3500]
[live2d_motion name="haru" filenm="tapBody_02.mtn"]
[wait time=3000]
[live2d_motion name="haru" filenm="idle_00.mtn" idle="ON"]


表情モーションも再生できるよ[p]
[live2d_expression name="haru" filenm="f03"]
怒ったり、
[wait time=1500]
[live2d_expression name="haru" filenm="f04"]
困ったり、
[wait time=1500]
[live2d_expression name="haru" filenm="f06"]
びっくりしたり、
[wait time=1500]
[live2d_expression name="haru" filenm="f07"]
表情豊かなキャラクターを表現できますね♪[p]
[wait time=1500]
;表情をデフォルトに戻す
[live2d_expression name="haru" filenm="f01"]


あとキャラクターの色も変えられるよ[p]
; haruの色を変える
[live2d_color name="haru" red=0.3 green=0.3 blue=0.3]
[wait time=1500]
[live2d_color name="haru" red=0.6 green=0.3 blue=0.3]
[wait time=1500]
; haruを元の色に戻す
[live2d_color name="haru" red=1.0 green=1.0 blue=1.0]


友達を紹介するね。イプシロンちゃーんっ！[p]
[live2d_trans name="haru" left=-200 top=0]
[wait time=1000]

#イプシロンちゃん
[live2d_show name="Epsilon"]
[live2d_trans name="Epsilon" left=160 top=-130]
はいはーい[p]
[wait time=1000]
; アイドルモーションの指定
[live2d_motion name="Epsilon" filenm="Epsilon2.1_m_04.mtn"]

ねっ、これでLive2Dを使ったゲームも作れるね！[p]
[live2d_motion name="haru" filenm="idle_02.mtn"]
[live2d_motion name="Epsilon" filenm="Epsilon2.1_m_sp_01.mtn" idle="ON"]
じゃあ、ゲーム開発を頑張ってね。[r]ばいばーい[p]
[live2d_delete name="haru"]
[live2d_delete name="Epsilon"]

#
