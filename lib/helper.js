const Nightmare = require('nightmare')
// require('nightmare-upload')(Nightmare);
const { exec } = require('child_process')

module.exports = {
  getGitVersio: async ()=>{
    return new Promise((resolve, reject)=>{
      exec('git log -n 1', (err, stdout, stderr)=>{
        if (err) {
          reject(err)
          return
        }

        resolve(stdout.match(/.*(commit) (\w+)/)[2])
      })
    })
  },
  getGitFullVersio: async ()=>{
    return new Promise((resolve, reject)=>{
      exec('git log -n 1', (err, stdout, stderr)=>{
        if (err) {
          reject(err)
          return
        }

        resolve(stdout)
      })
    })
  },
  createNm: () => {
    return Nightmare({
      show: true,
      openDevTools: {
        mode: 'detach'
      },
      // goto和load的超时已经设置的情况下，按理说wait超时只能是页面不对
      waitTimeout: 30 * 1000,
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
      show: true,
      openDevTools: {
        mode: 'detach'
      },
      // goto和load的超时已经设置的情况下，按理说wait超时只能是页面不对
      waitTimeout: 30 * 1000,
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
      waitTimeout: 30 * 1000,
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
  createNmWithOption: (option) => {
    let params = {
      show: true,
      openDevTools: {
        mode: 'detach'
      },
      // goto和load的超时已经设置的情况下，按理说wait超时只能是页面不对
      waitTimeout: 30 * 1000,
      pollInterval: 250,
      gotoTimeout: 60 * 1000,
      loadTimeout: 60 * 1000,
      executionTimeout: 60 * 1000,
      webPreferences: {
        images: false,
        webSecurity: false,
        allowRunningInsecureContent: true
      }
    };

    if (option.server) {
      params.switches = {
        'proxy-server': option.server,
        'ignore-certificate-errors': true
      }
    }

    if (option.persist) {
      params.webPreferences.partition = `persist:${option.persist}`
    }

    return Nightmare(params)
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
