CONFIDENTIAL
============================================================
	Live2D x TYRANOSCRIPTプラグイン v1.00
	(c) Live2D Inc.
============================================================
ティラノスクリプト上でLive2Dを動かすプラグインです。

このプラグインを動作させるには、Live2D SDK(WebGL版)が必要になりますので
Live2Dサイト(http://www.live2d.com/download)からDLし

data/others/live2d/lib配下にlibe2d.min.jsを置いて下さい。



------------------------------
	ライセンスについて
------------------------------
	このプラグインはLive2D SDKと同じライセンスです。
	
	for business
	http://www.live2d.com/sdk_license_cubism_indie

	for indie
	http://www.live2d.com/sdk_license_cubism

	プラグインに含まれているLive2Dモデル（ハル、イプシロン）については、Live2Dのガイドラインに準拠します

	【ガイドライン】http://sites.cybernoids.jp/cubism2/samples/character_guideline


------------------------------
	リリースノート
------------------------------
	1.0.02(2015/02/10)
		IEとMobile safariにて透明部分が黒くなるものをテクスチャゴミ取りツールで修正
		
	1.0.01(2015/01/29)
		Live2Dモデル削除時の不要な処理を削除

	1.0.00(2015/01/27)
		公開


------------------------------
	モデルを差し替える場合
------------------------------
others/live2d/assets配下を差し替えし、
others/live2d/Live2Dmodel.jsをエディタで開きファイルのパスを修正して下さい。
motionsの下にsoundの記載があるとモーション再生時に音声も一緒に流れます。

LIVE2D_MODEL['キャラ名']で指定した'キャラ名'がタグリファレンスに指定してる"キャラ名"になります。


------------------------------
	透過箇所が黒くなる場合
------------------------------
黒い縁が出る場合、テクスチャゴミ取りツールをお使い下さい。

Cubism SDK > Tips > テクスチャの表示がおかしい場合
https://sites.google.com/a/cybernoids.jp/cubism2/sdk_tutorial/tips/texture
ツール > テクスチャゴミ取りツール
https://sites.google.com/a/cybernoids.jp/cubism2/tools/texture


------------------------------
	タグリファレンス
------------------------------
【プラグインの読み込み】
[call storage="live2d/live2d.ks"]

・Live2Dモデルの生成
　[live2d_new name="キャラ名"]
　【パラメータ一覧】
　　name     : 【必須】Live2DモデルID(Live2Dmodel.jsで付けた名前)
　　left     : Live2Dモデルの横位置(Canvasの横位置)
　　top      : Live2Dモデルの縦位置(Canvasの縦位置)
　　width    : Live2Dモデルの横幅(Canvasの横幅)
　　height   : Live2Dモデルの縦幅(Canvasの縦幅)
　　zindex   : Live2Dモデルの奥行き(Canvasの奥行き)
　　glleft   : Canvas内のLive2Dモデル横位置(0.0〜2.0ぐらい)
　　gltop    : Canvas内のLive2Dモデル縦位置(0.0〜2.0ぐらい)
　　glscale  : Canvas内のLive2Dモデル拡大縮小サイズ(0.0〜2.0ぐらい)

・Live2Dモデルの表示
 [live2d_show name="キャラ名"]
　【パラメータ一覧】
　　name     : 【必須】Live2DモデルID(Live2Dmodel.jsで付けた名前)
　　time     : 切り替え時間(1000=1秒)

・Live2Dモデルの非表示
 [live2d_hide name="キャラ名"]
　【パラメータ一覧】
　　name     : 【必須】Live2DモデルID(Live2Dmodel.jsで付けた名前)
　　time     : 切り替え時間(1000=1秒)

・Live2Dモデルの透明度
 [live2d_opacity name="キャラ名"]
　【パラメータ一覧】
　　name     : 【必須】Live2DモデルID(Live2Dmodel.jsで付けた名前)
　　opacity  : 透明度(0.0～1.0)
　　time     : 切り替え時間(1000=1秒)

・Live2Dモデルの退場
 [live2d_delete name="キャラ名"]
　【パラメータ一覧】
　　name     : 【必須】Live2DモデルID(Live2Dmodel.jsで付けた名前)

・Live2Dモデルのモーション再生
 [live2d_motion name="キャラ名"]
　【パラメータ一覧】
　　name     : 【必須】Live2DモデルID(Live2Dmodel.jsで付けた名前)
　　filenm   : モーション番号(Live2Dmodel.jsのmotions配下。上から0,1,2...)

・Live2Dモデルの移動
 [live2d_trans name="キャラ名"]
　【パラメータ一覧】
　　name     : 【必須】Live2DモデルID(Live2Dmodel.jsで付けた名前)
　　left     : 【必須】X位置
　　top      : 【必須】Y位置
　　time     : 切り替え時間(1000=1秒)

・Live2Dモデルの回転
 [live2d_rotate name="キャラ名"]
　【パラメータ一覧】
　　name     : 【必須】Live2DモデルID(Live2Dmodel.jsで付けた名前)
　　rotate   : 【必須】回転角度
　　time     : 切り替え時間(1000=1秒)

・Live2Dモデルの拡大・縮小
 [live2d_scale name="キャラ名"]
　【パラメータ一覧】
　　name     : 【必須】Live2DモデルID(Live2Dmodel.jsで付けた名前)
　　scaleX   : 【必須】Xスケール
　　scaleY   : 【必須】Yスケール
　　time     : 切り替え時間(1000=1秒)

・Live2Dモデルを揺らす
 [live2d_shake name="キャラ名"]
　【パラメータ一覧】
　　name     : 【必須】Live2DモデルID(Live2Dmodel.jsで付けた名前)


------------------------------
	フォルダ構成
------------------------------
live2dplugin	
│
│  readme.txt
│
└─data
    ├─image
    │  button1.png
    │
    ├─bgimage
    │  room.jpg
    │
    ├─others
    │    └─live2d
    │          │  Live2Dmodel.js     モデルファイルパスを記述するファイル
    │          │  Live2Dtyrano.js    Live2Dとティラノスクリプトを連携させるjs
    │          │
    │          ├─assets    Live2Dモデルファイルの配置先
    │          │  │
    │          │  ├─Epsilon
    │          │  │  │  Epsilon_free.moc
    │          │  │  │  Epsilon_free.model.json
    │          │  │  │  Epsilon_free.physics.json
    │          │  │  │
    │          │  │  ├─Epsilon_free.2048
    │          │  │  │      texture_00.png
    │          │  │  │
    │          │  │  ├─expressions
    │          │  │  │      f01.exp.json
    │          │  │  │      f02.exp.json
    │          │  │  │      f03.exp.json
    │          │  │  │      f04.exp.json
    │          │  │  │      f05.exp.json
    │          │  │  │      f06.exp.json
    │          │  │  │      f07.exp.json
    │          │  │  │      f08.exp.json
    │          │  │  │
    │          │  │  └─motions
    │          │  │          Epsilon_free_idle_01.mtn
    │          │  │          Epsilon_free_m_01.mtn
    │          │  │          Epsilon_free_m_02.mtn
    │          │  │          Epsilon_free_m_03.mtn
    │          │  │          Epsilon_free_m_04.mtn
    │          │  │          Epsilon_free_m_05.mtn
    │          │  │          Epsilon_free_m_06.mtn
    │          │  │          Epsilon_free_m_07.mtn
    │          │  │          Epsilon_free_m_08.mtn
    │          │  │          Epsilon_free_m_sp_01.mtn
    │          │  │          Epsilon_free_m_sp_02.mtn
    │          │  │          Epsilon_free_m_sp_03.mtn
    │          │  │          Epsilon_free_m_sp_04.mtn
    │          │  │          Epsilon_free_m_sp_05.mtn
    │          │  │          Epsilon_free_shake_01.mtn
    │          │  │
    │          │  └─haru
    │          │      │  haru.moc
    │          │      │
    │          │      ├─haru.1024
    │          │      │      texture_00.png
    │          │      │      texture_01.png
    │          │      │      texture_02.png
    │          │      │
    │          │      ├─motions
    │          │      │      haru_idle_01.mtn
    │          │      │      haru_idle_02.mtn
    │          │      │      haru_idle_03.mtn
    │          │      │      haru_m_01.mtn
    │          │      │      haru_m_02.mtn
    │          │      │      haru_m_03.mtn
    │          │      │      haru_m_04.mtn
    │          │      │      haru_m_05.mtn
    │          │      │      haru_m_06.mtn
    │          │      │      haru_m_07.mtn
    │          │      │      haru_m_08.mtn
    │          │      │      haru_m_09.mtn
    │          │      │      haru_m_10.mtn
    │          │      │      haru_normal_01.mtn
    │          │      │      haru_normal_02.mtn
    │          │      │      haru_normal_03.mtn
    │          │      │      haru_normal_04.mtn
    │          │      │      haru_normal_05.mtn
    │          │      │      haru_normal_06.mtn
    │          │      │      haru_normal_07.mtn
    │          │      │      haru_normal_08.mtn
    │          │      │      haru_normal_09.mtn
    │          │      │      haru_normal_10.mtn
    │          │      │
    │          │      └─sounds
    │          │              haru_normal_01.mp3
    │          │              haru_normal_02.mp3
    │          │              haru_normal_03.mp3
    │          │              haru_normal_04.mp3
    │          │              haru_normal_05.mp3
    │          │              haru_normal_06.mp3
    │          │              haru_normal_07.mp3
    │          │              haru_normal_08.mp3
    │          │              haru_normal_09.mp3
    │          │              haru_normal_10.mp3
    │          │
    │          ├─framework
    │          │      Live2DFramework.js    Live2Dのモーション再生機能を提供するjs
    │          │
    │          └─lib
    │                  live2d.min.js    Live2Dのライブラリ(※　Live2DサイトからＤＬしてくる)
    │
    └─scenario
          └─live2d
                    live2d.ks    Live2Dのマクロファイル

