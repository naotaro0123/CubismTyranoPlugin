declare namespace TYRANO {

    class kag {
        static appendMessage(jtext: any, str: any): void;
        cache_html: {};
        static checkMessage(jtext: any): void;
        static clearTmpVariable(): void;
        static clearVariable(): void;
        static config: config;
        define: {};
        static embScript(str: any, preexp: any): void;
        static endStorage(): void;
        static error(err: any): void;
        static evalScript(str: any): void;
        static getMessageCurrentSpan(): void;
        static getMessageInnerLayer(): void;
        static getMessageOuterLayer(): void;
        static getStack(name: any): void;
        static html(html_file_name: any, data: any, callback: any): void;
        static init(): void;
        static init_game(): void;
        is_rider: boolean;
        kag: any;
        static loadScenario(file_name: any, call_back: any): void;
        static log(obj: any): void;
        options: {};
        static popAnimStack(): void;
        static popStack(name: any): void;
        static preload(src: any, callbk: any): void;
        static pushAnimStack(): void;
        static pushBackLog(str: any): void;
        static pushStack(name: any, flag: any): void;
        static saveSystemVariable(): void;
        static setCursor(cursor: any): void;
        static setMessageCurrentSpan(): void;
        static setStack(name: any, flag: any): void;
        static setStyles(j_obj: any, array_style: any): void;
        static setTitle(title: any): void;
        sound_swf: any;
        static stat: stat;
        static test(): void;
        tmp: {};
        tyrano: any;
        variable: {};
        static warning(str: any): void;
        static layer: layer;
    }

    class stat {
        set_text_span : boolean;
        f: f;
        mp: any;
        current_scenario: any;
        current_line: any;
        current_layer: any;
        current_page: any;
        visible_menu_button: any;
        default_font: any;
        vertical: any;
        font: any;
        is_strong_stop: boolean;
        map_label: any;
        is_stop: boolean;
        current_cursor: any;
        title: any;
    }
    class f {
        live2d_models: any;
    }

    class config {
        configSave: any;
        defaultStorageExtension: any;
        mediaFormatDefault: any;
        preload: any;
        projectID: any;
        skipSpeed: any;
        scWidth: any;
        scHeight: any;
    }

    class layer {
        addLayer(layer_name: string): void;
        appendImage(image_obj: any): void;
        appendLayer(layer_obj: any): void;
        appendObj(layer_obj: any, page: any, obj: any): void;
        backlay(layer: any): void;
        clearMessageInnerLayerAll(): void;
        end_point: {};
        forelay(layer: any): void;
        getFreeLayer(): void;
        getLayer(layer_name: string, page: any): any;
        getLayeyHtml(): void;
        getMenuLayer(): void;
        hideEventLayer(): void;
        hideFixLayer(): void;
        hideMessageLayers(): void;
        init(): void;
        kag : any;
        layer_event : {};
        layer_free : {};
        layer_menu : {};
        map_layer_back : {};
        map_layer_fore : {};
        refMessageLayer(): void;
        setLayerHtml(layer: any): void;
        showEventLayer(): void;
        showFixLayer(): void;
        showMessageLayers(): void;
        start_point: {};
        test(): void;
        tyrano: any;
        updateLayer(layer_name: string, page: any, layer_obj: any): void;
    }
}
