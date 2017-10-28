import { join } from 'path';

import { SeedConfig } from './seed.config';
import { ExtendPackages } from './seed.config.interfaces';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

  FONTS_DEST = `${this.APP_DEST}/fonts`;
  FONTS_SRC = [
    'node_modules/bootstrap/dist/fonts/**',
    'node_modules/font-awesome/fonts/**'
  ];

  constructor() {
    super();
    this.SYSTEM_CONFIG_DEV.packageConfigPaths = [
      `/node_modules/*/package.json`,
      `/node_modules/**/package.json`,
      `/node_modules/@angular/*/package.json`
    ];

    this.APP_TITLE = 'SOLS CONSOLE';
    // this.GOOGLE_ANALYTICS_ID = 'Your site's ID';

    /* Enable typeless compiler runs (faster) between typed compiler runs. */
    // this.TYPED_COMPILE_INTERVAL = 5;

    // Add `NPM` third-party libraries to be injected/bundled.
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,
      { src: 'jquery/dist/jquery.min.js', inject: 'libs' },
      // {src: 'lodash/lodash.min.js', inject: 'libs'},
      { src: 'tether/dist/js/tether.min.js', inject: 'libs' },
      { src: 'tether/dist/css/tether.min.css', inject: true },
      // { src: 'tether-tooltip/dist/js/tooltip.min.js', inject: 'libs'},
      // { src: 'tether-tooltip/dist/css/tooltip-theme-arrows.css', inject: true },
      // { src: 'tether-tooltip/dist/css/tooltip-theme-twipsy.css', inject: true },
      { src: 'bootstrap/dist/js/bootstrap.min.js', inject: 'libs' },
      { src: 'bootstrap/dist/css/bootstrap.min.css', inject: true }, // inject into css section
      //{ src: 'bootstrap/dist/css/bootstrap-theme.min.css', inject: true }, // inject into css section
      //{ src: 'bootstrap/dist/css/bootstrap-theme.min.css.map', inject: true }, // inject into css section
      { src: 'font-awesome/css/font-awesome.min.css', inject: true },
      { src: 'primeng/resources/primeng.min.css', inject: true },
      { src: 'primeng/resources/themes/bootstrap/theme.css', inject: true },
      { src: 'primeng/resources/themes/omega/theme.css', inject: true },
    ];

    // Add `local` third-party libraries to be injected/bundled.
    this.APP_ASSETS = [
      { src: `${this.CSS_SRC}/login.css`, inject: true, vendor: false },
      { src: `${this.ASSETS_SRC}/scripts/spin/spin.js`, inject: true, vendor: false },
      { src: `${this.ASSETS_SRC}/scripts/spin/jquery.spin.js`, inject: true, vendor: false }
      // {src: `${this.APP_SRC}/your-path-to-lib/libs/jquery-ui.js`, inject: true, vendor: false}
      // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
    ];

    this.ROLLUP_INCLUDE_DIR = [
      ...this.ROLLUP_INCLUDE_DIR,
      //'node_modules/moment/**'
    ];

    this.ROLLUP_NAMED_EXPORTS = [
      ...this.ROLLUP_NAMED_EXPORTS,
      //{'node_modules/immutable/dist/immutable.js': [ 'Map' ]},
    ];

    let additionalPackages: ExtendPackages[] = [

      // required for dev build
      {
        name: 'ngx-bootstrap',
        path: `${this.APP_BASE}node_modules/ngx-bootstrap/bundles/ngx-bootstrap.umd.min.js`
      },

      // required for prod build
      {
        name: 'ngx-bootstrap/*',
        path: `${this.APP_BASE}node_modules/ngx-bootstrap/bundles/ngx-bootstrap.umd.min.js`
      },
      // required for dev build
      {
        name: 'angular2-fontawesome',
        path: `${this.APP_BASE}node_modules/angular2-fontawesome/bundles/angular2-fontawesome.umd.min.js`
      },

      // required for prod build
      {
        name: 'angular2-fontawesome/*',
        path: `${this.APP_BASE}node_modules/angular2-fontawesome/bundles/angular2-fontawesome.umd.min.js`
      },
      {
        name: 'primeng',
        path: `${this.APP_BASE}node_modules/primeng/`
      },
      {
        name: 'primeng/*',
        path: `${this.APP_BASE}node_modules/primeng/`
      },

      {
        // mandatory dependency for ngx-bootstrap datepicker
        name: 'moment',
        path: `${this.APP_BASE}node_modules/moment`,
        packageMeta: {
          main: 'moment.js',
          defaultExtension: 'js'
        }
      },
      {
        name: 'lodash',
        path: `${this.APP_BASE}node_modules/lodash/lodash.js`,
        packageMeta: {
          main: 'index.js',
          defaultExtension: 'js'
        }
      },
      // {
      //   name: 'angular2-jwt',
      //   // Path to the package's bundle
      //   path: `${this.APP_BASE}node_modules/angular2-jwt`,
      //   packageMeta: {
      //     defaultExtension: 'js'
      //   }
      // }
    ];

    let prodAdditionalPacks: ExtendPackages[] = [

      // required for dev build
      {
        name: 'ngx-bootstrap',
        path: `node_modules/ngx-bootstrap/bundles/ngx-bootstrap.umd.min.js`
      },

      // required for prod build
      {
        name: 'ngx-bootstrap/*',
        path: `node_modules/ngx-bootstrap/bundles/ngx-bootstrap.umd.min.js`
      },
      // required for dev build
      {
        name: 'angular2-fontawesome',
        path: `node_modules/angular2-fontawesome/bundles/angular2-fontawesome.umd.min.js`
      },

      // required for prod build
      {
        name: 'angular2-fontawesome/*',
        path: `node_modules/angular2-fontawesome/bundles/angular2-fontawesome.umd.min.js`
      },
      {
        name: 'primeng',
        path: `node_modules/primeng/`
      },
      {
        name: 'primeng/*',
        path: `node_modules/primeng/`
      },

      {
        // mandatory dependency for ngx-bootstrap datepicker
        name: 'moment',
        path: `node_modules/moment`,
        packageMeta: {
          main: 'moment.js',
          defaultExtension: 'js'
        }
      },
      {
        name: 'lodash',
        path: `node_modules/lodash/lodash.js`,
        packageMeta: {
          main: 'index.js',
          defaultExtension: 'js'
        }
      },
      // {
      //   name: 'angular2-jwt',
      //   // Path to the package's bundle
      //   path: 'node_modules/angular2-jwt',
      //   packageMeta: {
      //     defaultExtension: 'js'
      //   }
      // }
    ];

    (this.BUILD_TYPE !== 'prod') ? this.addPackagesBundles(additionalPackages) : this.addPackagesBundles(prodAdditionalPacks);


    // Add packages (e.g. ng2-translate)
    // let additionalPackages: ExtendPackages[] = [{
    //   name: 'ng2-translate',
    //   // Path to the package's bundle
    //   path: 'node_modules/ng2-translate/bundles/ng2-translate.umd.js'
    // }];
    //
    // this.addPackagesBundles(additionalPackages);
    //Reference:  https://github.com/valor-software/ngx-bootstrap/blob/development/docs/getting-started/bootstrap4.md
    //https://github.com/valor-software/ngx-bootstrap/blob/development/docs/getting-started/angular-seed.md
    //https://www.npmjs.com/package/ng2-bootstrap
    //https://github.com/ng-bootstrap/ng-bootstrap




    /* Add proxy middleware */
    // this.PROXY_MIDDLEWARE = [
    //   require('http-proxy-middleware')('/api', { ws: false, target: 'http://localhost:3003' })
    // ];

    /* Add to or override NPM module configurations: */
    // this.PLUGIN_CONFIGS['browser-sync'] = { ghostMode: false };
  }

}
