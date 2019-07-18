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

export const isMobile = () => {
  if (sessionStorage.desktop) return false;
  if (localStorage.mobile) return true;
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
};
