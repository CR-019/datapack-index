// .vitepress/theme/process-polyfill.js

// 如果是在浏览器环境且没有 process 对象，则创建一个模拟对象
if (typeof window !== 'undefined' && !window.process) {
  window.process = {
    env: {},
    version: '',
    browser: true,
    platform: 'browser',
    arch: 'browser',
    nextTick: function (cb) {
      setTimeout(cb, 0);
    }
  };
}

// 同时也挂载到 globalThis，防止某些库通过 globalThis 访问
if (typeof globalThis !== 'undefined' && !globalThis.process) {
  globalThis.process = window.process;
}