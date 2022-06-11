export const confirmAction = <T>(question: string, cb: (data: T) => void): (data: T) => void => {
  return d => {
    if (confirm(question)) {
      return cb(d);
    }
  }
}
