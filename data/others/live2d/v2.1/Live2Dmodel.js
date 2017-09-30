// プリロードするモーショングループ
// (尺が長いモーションは事前ロードするのでmodel.jsonのidleグループに入れて下さい)
var PRELOAD_GROUP = "idle";

// Live2Dモデルの配列
var LIVE2D_MODEL = [];

// Live2Dモデル（haru）
LIVE2D_MODEL['haru'] = {
    "filepath": "data/others/live2d/v2.1/assets/haru/",
    "modeljson": "haru.model.json"
};

// Live2Dモデル（Epsilon2.1）
LIVE2D_MODEL['Epsilon'] = {
    "filepath": "data/others/live2d/v2.1/assets/Epsilon2.1/",
    "modeljson": "Epsilon2.1.model.json"
};