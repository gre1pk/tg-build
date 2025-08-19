import {
  bindThemeParamsCssVars,
  bindViewportCssVars,
  emitEvent,
  init as initSDK,
  miniApp,
  mockTelegramEnv,
  mountBackButton,
  mountViewport,
  restoreInitData,
  retrieveLaunchParams,
  setDebug,
  type ThemeParams,
  themeParamsState,
} from '@telegram-apps/sdk-react';

export async function init(options: { debug: boolean; mockForMacOS: boolean }): Promise<void> {
  setDebug(options.debug);
  initSDK();

  if (options.mockForMacOS) {
    let firstThemeSent = false;
    mockTelegramEnv({
      onEvent(event, next) {
        if (event[0] === 'web_app_request_theme') {
          let tp: ThemeParams = {};
          if (firstThemeSent) {
            tp = themeParamsState();
          } else {
            firstThemeSent = true;
            tp ||= retrieveLaunchParams().tgWebAppThemeParams;
          }
          return emitEvent('theme_changed', { theme_params: tp });
        }

        if (event[0] === 'web_app_request_safe_area') {
          return emitEvent('safe_area_changed', { left: 0, top: 0, right: 0, bottom: 0 });
        }

        next();
      },
    });
  }

  mountBackButton.ifAvailable();
  restoreInitData();

  if (miniApp.mountSync.isAvailable()) {
    miniApp.mountSync();
    bindThemeParamsCssVars();
  }

  mountViewport.isAvailable() &&
    mountViewport().then(() => {
      bindViewportCssVars();
    });
}
