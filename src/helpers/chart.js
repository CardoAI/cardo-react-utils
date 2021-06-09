export function scaleDataAxesToUnifyZeroes(datasets, options) {
  let axes = options.scales.yAxes;
  // Determine overall max/min values for each dataset
  datasets.forEach(function (line) {
    let axis = line.yAxisID ? axes.filter(ax => ax.id === line.yAxisID)[0] : axes[0];
    axis.min_value = Math.min(...line.data, axis.min_value || 0);
    axis.max_value = Math.max(...line.data, axis.max_value || 0)
  });
  // Which gives the overall range of each axis
  axes.forEach(axis => {
    axis.range = axis.max_value - axis.min_value;
    // Express the min / max values as a fraction of the overall range
    axis.min_ratio = axis.min_value / axis.range;
    axis.max_ratio = axis.max_value / axis.range
  });
  // Find the largest of these ratios
  let largest = axes.reduce((a, b) => ({
    min_ratio: Math.min(a.min_ratio, b.min_ratio),
    max_ratio: Math.max(a.max_ratio, b.max_ratio)
  }));
  // Then scale each axis accordingly
  axes.forEach(axis => {
    axis.ticks = axis.ticks || {};
    axis.ticks.min = largest.min_ratio * axis.range;
    axis.ticks.max = largest.max_ratio * axis.range;
  })
}

export function hex2rgb(hex, opacity) {
  let h = hex.replace('#', '');
  h = h.match(new RegExp('(.{' + h.length / 3 + '})', 'g'));

  for (let i = 0; i < h.length; i++)
    h[i] = parseInt(h[i].length == 1 ? h[i] + h[i] : h[i], 16);

  if (typeof opacity != 'undefined') h.push(opacity);

  return 'rgba(' + h.join(',') + ')';
}