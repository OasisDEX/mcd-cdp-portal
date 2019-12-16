// https://stackoverflow.com/a/43963612/56817
export const uniqueId = (() => {
  let currentId = 0;
  const map = new WeakMap();

  return object => {
    if (!map.has(object)) {
      map.set(object, ++currentId);
    }

    return map.get(object);
  };
})();

export const getQueryParamByName = (name, url) => {
  if (!url) url = window.location.href;
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
