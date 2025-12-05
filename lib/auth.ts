const LOGIN_EMAIL_DOMAIN =
  process.env.NEXT_PUBLIC_LOGIN_EMAIL_DOMAIN || "kenda.test";

export function buildAuthEmail(loginIdentifier: string) {
  return `${loginIdentifier.toLowerCase()}@${LOGIN_EMAIL_DOMAIN}`;
}

