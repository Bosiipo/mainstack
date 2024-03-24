import pino from 'pino';

export default pino({
  formatters: {
    level(level) {
      return {level};
    },
  },
});
