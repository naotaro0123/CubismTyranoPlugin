// プリロードするモーショングループ
// (尺が長いモーションは事前ロードするのでmodel.jsonのidleグループに入れて下さい)
const PRELOAD_GROUP: string = "idle";

// Live2Dモデルの配列
let LIVE2D_MODEL: any = [];

// Live2Dモデル（haru）
LIVE2D_MODEL['haru'] = {
    "filepath": "data/others/live2d/v3.0/assets/haru/",
    "modeljson": "haru.model3.json"
};
// Live2Dモデル（koharu）
LIVE2D_MODEL['koharu'] = {
    "filepath": "data/others/live2d/v3.0/assets/koharu/",
    "modeljson": "koharu.model3.json"
};
// Live2Dモデル（unitychan）
LIVE2D_MODEL['unitychan'] = {
    "filepath": "data/others/live2d/v3.0/assets/unitychan/",
    "modeljson": "unitychan.model3.json"
};