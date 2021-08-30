export const downloadCsvFile = (config) => {
  const {file, title} = config;
  const element = document.createElement('a');
  const blob = new Blob([file], {type: 'text/csv;charset=utf-8;'});

  element.href = URL.createObjectURL(blob);
  element.setAttribute('download', `${title || "File"}.csv`);
  element.click();
}