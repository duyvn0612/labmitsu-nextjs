export const rand = (min, max) => Math.random() * (max - min) + min;

export const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
