export default {
  log(...args) {
    log('log', ...args)
  },
  info(...args) {
    log('info', ...args)
  },
  warn(...args) {
    log('warn', ...args)
  },
  error(...args) {
    log('error', ...args)
  },
}

function log(type, ...args) {
  if (require('./config').isDev) {
    console[type](...args)
  }
}
