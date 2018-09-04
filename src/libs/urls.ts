export function parseSlashAccountUrl(url: string, domain: string): string {
  return parseAccountUrl(url, new RegExp(`\\/\\/${domain}\\/@?([^/\\s?]+)`, 'i'));
}

export function parseAccountUrl(url: string, regex: RegExp): string {
  const matches = url.match(regex);
  if (matches && matches[1]) {
    return matches[1];
  }
  throw `The given URL could not be resolved to an account of this type!`;
}
