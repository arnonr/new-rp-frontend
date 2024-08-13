import { createApp } from "vue";
import { createPinia } from "pinia";
import { Tooltip } from "bootstrap";
import App from "./App.vue";

/*
TIP: To get started with clean router change path to @/router/clean.ts.
 */
import router from "./router";
import ElementPlus from "element-plus";
import i18n from "@/core/plugins/i18n";

//imports for app initialization
import ApiService from "@/core/services/ApiService";
import { initApexCharts } from "@/core/plugins/apexcharts";
import { initInlineSvg } from "@/core/plugins/inline-svg";
import { initVeeValidate } from "@/core/plugins/vee-validate";
import { initKtIcon } from "@/core/plugins/keenthemes";

import "@/core/plugins/prismjs";

import FroalaEditor from "froala-editor";
import "froala-editor/js/plugins.pkgd.min.js";

//Import third party plugins
import "froala-editor/js/third_party/embedly.min";
import "froala-editor/js/third_party/font_awesome.min";
// import "froala-editor/js/third_party/spell_checker.min";
import "froala-editor/js/third_party/image_tui.min";

// Import Froala Editor css files.
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";

declare global {
  interface Window {
    FroalaEditor: typeof FroalaEditor;
  }
}

// window.FroalaEditor = FroalaEditor;

import VueFroala from "vue-froala-wysiwyg";
import("@wiris/mathtype-froala3");
// if (window.FroalaEditor) {
//   import("@wiris/mathtype-froala3");
// } else {
//   console.error("FroalaEditor is not loaded");
// }

window.FroalaEditor = FroalaEditor;

import { abilitiesPlugin } from "@casl/vue";
import ability from "./services/ability";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.use(VueFroala);

app.use(abilitiesPlugin, ability, {
  useGlobalProperties: true,
});

ApiService.init(app);
initApexCharts(app);
initInlineSvg(app);
initKtIcon(app);
initVeeValidate();

app.use(i18n);

app.directive("tooltip", (el) => {
  new Tooltip(el);
});

app.mount("#app");
