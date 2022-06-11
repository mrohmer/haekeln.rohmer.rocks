export const debounceTime = <T>(cb: (data: T) => void, time = 1): (data: T) => void => {
  let timer: any;
  return d => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      cb(d);
    }, time);
  }
}
