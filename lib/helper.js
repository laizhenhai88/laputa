const Nightmare = require('nightmare');
// require('nightmare-upload')(Nightmare);

module.exports = {
  createNm: () => {
    return Nightmare({
      show: false,
      openDevTools: {
        mode: 'detach'
      },
      // goto和load的超时已经设置的情况下，按理说wait超时只能是页面不对
      waitTimeout: 10 * 1000,
      pollInterval: 250,
      gotoTimeout: 60 * 1000,
      loadTimeout: 60 * 1000,
      executionTimeout: 60 * 1000,
      webPreferences: {
        images: false,
        webSecurity: false,
        allowRunningInsecureContent: true
      }
    })
  },
  createNmByPt: (persist) => {
    return Nightmare({
      show: false,
      openDevTools: {
        mode: 'detach'
      },
      // goto和load的超时已经设置的情况下，按理说wait超时只能是页面不对
      waitTimeout: 10 * 1000,
      pollInterval: 250,
      gotoTimeout: 60 * 1000,
      loadTimeout: 60 * 1000,
      executionTimeout: 60 * 1000,
      webPreferences: {
        images: true,
        webSecurity: false,
        allowRunningInsecureContent: true,
        partition: `persist:${persist}`
      }
    })
  },
  createNmWithProxy: (server) => {
    return Nightmare({
      show: true,
      openDevTools: {
        mode: 'detach'
      },
      switches: {
        'proxy-server': server,
        'ignore-certificate-errors': true
      },
      // goto和load的超时已经设置的情况下，按理说wait超时只能是页面不对
      waitTimeout: 10 * 1000,
      pollInterval: 250,
      gotoTimeout: 60 * 1000,
      loadTimeout: 60 * 1000,
      executionTimeout: 60 * 1000,
      webPreferences: {
        images: false,
        webSecurity: false,
        allowRunningInsecureContent: true
      }
    })
  },
  renderCookies: (cookies) => {
    cookies.forEach((v, k) => {
      let url = v.domain;
      if (v.domain.startsWith('.')) {
        url = v.domain.substring(1);
      }
      if (v.secure) {
        v.url = 'https://' + url;
      } else {
        v.url = 'http://' + url;
      }
    });

    return cookies;
  }
}
