export function withProtocol(url: string): string {
  return /^[a-z]+:\/\//i.test(url) ? url : `https://${url}`;
}
