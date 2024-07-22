export function isExpired(expiry: Date) {
  return new Date() > expiry;
}
