/**
 * Runtime guard. @noble/ed25519 reads globalThis.crypto.getRandomValues
 * for key generation; on Node 18 (and on Node 19 without
 * --experimental-global-webcrypto) that's undefined. Surface a clear
 * error at module-load time rather than letting the failure surface
 * inside a key-generation call stack with no actionable detail.
 */
if (typeof globalThis.crypto?.getRandomValues !== "function") {
  throw new Error(
    "@crawlertoll/client requires Web Crypto (globalThis.crypto.getRandomValues). " +
      "Node 20+ has this built in. On Node 18 (EOL April 2025), upgrade to Node 20. " +
      "On Node 19, run with --experimental-global-webcrypto, or polyfill before " +
      "importing: globalThis.crypto = (await import('node:crypto')).webcrypto;",
  );
}

/**
 * @crawlertoll/client — buyer SDK for CrawlerToll.
 *
 *   import { CrawlerTollClient, verify } from "@crawlertoll/client";
 *
 *   const client = new CrawlerTollClient({ apiKey: process.env.CRAWLERTOLL_KEY! });
 *
 *   const { publishers } = await client.discover({
 *     topic: "Portuguese vehicle import tax",
 *     minQuality: 8,
 *   });
 *
 *   const { result, attestation } = await client.query({
 *     publisher: publishers[0].slug,
 *     endpoint:  "isv-calculator",
 *     args: { fuel: "diesel", displacement_cc: 1968, co2_gkm: 137, year: 2019, country_of_origin: "DE" },
 *   });
 *
 *   // Confirm the response came from the claimed publisher.
 *   const publisherKeyPem = "...";   // from /.well-known/context-license.json attestation.public_key_pem
 *   const verdict = await verify(attestation, publisherKeyPem);
 *   if (!verdict.valid) throw new Error(verdict.detail);
 *
 *   use(result);
 */

export { CrawlerTollClient } from "./client.js";
export { verify, signEnvelope } from "./verify.js";
export {
  pemToRawEd25519PublicKey,
  rawEd25519PublicKeyToPem,
} from "./pem.js";

export type {
  CrawlerTollClientOptions,
  DiscoverOptions,
  DiscoverResult,
  PublisherCard,
  QueryOptions,
  QueryResult,
  AttestationEnvelope,
  VerifyResult,
} from "./types.js";

export { CrawlerTollError } from "./types.js";
