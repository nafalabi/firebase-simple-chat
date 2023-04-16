function debounce<T extends Function>(func: T, wait: number) {
  var timeout: NodeJS.Timeout | undefined;
  return function() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    var context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      timeout = undefined;
      func.apply(context, args);
    }, wait);
  };
};

export default debounce;

