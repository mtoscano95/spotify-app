// HOF for async/await error handling

export const catchErrors = fn => {
    return function(...args) {
      return fn(...args).catch((err) => {
        console.error(err);
      })
    }
  }


// spotify returns duration of track in milisecs, convert this to a human reading type
  export const formatDuration = ms => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor(((ms % 60000) / 1000));
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }