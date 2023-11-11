/**
 * Funzione per serializzare un oggetto.
 * Default output: "hex"
 * @param {Any} obj oggetto da serializzare
 * @param {BufferEncoding} encoding encoding dell'output (default = "hex")
 * @returns
 */
export function serialize(obj: any, encoding: BufferEncoding = "hex") {
  return Buffer.from(JSON.stringify(obj)).toString(encoding);
}
