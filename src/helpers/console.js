/**
 * Helper function that clears all the console messages of any type
 */
export const clearConsole = () => {
  const func = () => {
  }
  ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn',
  ].forEach((method) => {
    window.console[method] = func
  })
}