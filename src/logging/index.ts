export const logger = {
  info(message: string, ...args: any[]) {
    const isWorker = typeof Window === 'undefined';
    console.info(
      [
        '%c',
        formatTime(new Date()),
        ' %c',
        isWorker ? 'BKG' : 'TAB',
        '%c ',
        message,
      ].join(''),
      'color: gray',
      `color: white; background: ${
        isWorker ? 'blue' : 'green'
      }; border-radius: 4px; padding-left: 4px; padding-right: 4px; padding-top: 2px; padding-bottom: 2px;`,
      'color: inherit;',
      ...args
    );
  },
};

function formatTime(date: Date) {
  return date.toTimeString().substring(0, 8);
}
