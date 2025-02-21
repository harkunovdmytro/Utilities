export function getType(value: any): any {
  if ((function() { // @ts-ignore
    return value && (value !== this);
  }).call(value)) {
    //fallback on 'typeof' for truthy primitive values
    return typeof value;
  }
  // @ts-ignore
  return ({}).toString.call(value).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
}