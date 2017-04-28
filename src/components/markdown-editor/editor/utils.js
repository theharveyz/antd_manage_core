export const generateNewValue = (editorTemp, value, inject) => {
  const v = value || '';
  const position = editorTemp.selectionStart || 0;
  const newValue = `${v.substring(0, position)}${inject}${v.substring(position)}`;
  const newPosition = position + inject.length;
  return { newValue, newPosition };
};

export const generateLink = () => ('[链接文字](http://)');

export const generateImg = (bucketUrl, file, newline = true) => {
  const imageUrl = `${bucketUrl}/${file.response.key}`;
  const imgLink = `![](${imageUrl})`;
  if (newline) return `\r\n${imgLink}\r\n`;
  return imgLink;
};

export const setFocus = (ref, position) => {
  if (ref) {
    const r = ref;
    r.selectionStart = position;
    r.selectionEnd = position;
    r.focus();
  }
};
