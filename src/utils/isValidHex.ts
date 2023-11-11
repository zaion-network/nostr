export function isValidHex(input: string): boolean {
  // const regexp = /^[a-f0-9]{64}$/;
  const regexp = /^[a-f0-9]/;
  return regexp.test(input);
}
