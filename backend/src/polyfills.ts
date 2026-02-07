import { randomUUID, webcrypto } from 'crypto';

type CryptoWithRandomUUID = Crypto & { randomUUID?: () => string };

const globalTarget = globalThis as typeof globalThis & {
  crypto?: CryptoWithRandomUUID;
};

if (!globalTarget.crypto) {
  globalTarget.crypto = webcrypto as CryptoWithRandomUUID;
}

if (typeof globalTarget.crypto.randomUUID !== 'function') {
  globalTarget.crypto.randomUUID = randomUUID;
}
