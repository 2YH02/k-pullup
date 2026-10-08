const isInternalReferrer = (
  referrer: string | null,
  host: string | null
): boolean => {
  if (!referrer || !host) return false;

  try {
    return new URL(referrer).host === host;
  } catch {
    return false;
  }
};

export default isInternalReferrer;
