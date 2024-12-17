import crypto from 'crypto';
import type { ILicenseV3 } from '@rocket.chat/core-typings';
import { verify, sign, getPairs } from '@rocket.chat/jwt';

const base64Decode = (key: string): string => Buffer.from(key, 'base64').toString('utf-8');

// Access keys from environment variables
const PUBLIC_LICENSE_KEY_V2 = process.env.PUBLIC_LICENSE_KEY_V2 || '';
const PUBLIC_STATS_KEY_V2 = process.env.PUBLIC_STATS_KEY_V2 || '';

const PUBLIC_LICENSE_KEY_V3 = base64Decode(PUBLIC_LICENSE_KEY_V2);

let TEST_KEYS: [string, string] | undefined = undefined;

export async function decryptStatsToken(encrypted: string): Promise<string> {
	if (process.env.NODE_ENV?.toLowerCase() === 'test') {
		TEST_KEYS = TEST_KEYS ?? (await getPairs());

		if (!TEST_KEYS) {
			throw new Error('Missing PUBLIC_STATS_KEY_V3');
		}

		const [spki] = TEST_KEYS;

		const [payload] = await verify(encrypted, spki);
		return JSON.stringify(payload);
	}

	const [payload] = await verify(encrypted, base64Decode(PUBLIC_STATS_KEY_V2));
	return JSON.stringify(payload);
}

export async function decrypt(encrypted: string): Promise<string> {
	if (process.env.NODE_ENV === 'test') {
		if (encrypted.startsWith('RCV3_')) {
			const jwt = encrypted.substring(5);

			TEST_KEYS = TEST_KEYS ?? (await getPairs());

			if (!TEST_KEYS) {
				throw new Error('Missing PUBLIC_LICENSE_KEY_V3');
			}

			const [spki] = TEST_KEYS;

			const [payload] = await verify(jwt, spki);
			return JSON.stringify(payload);
		}
	}

	if (encrypted.startsWith('RCV3_')) {
		const jwt = encrypted.substring(5);
		const [payload] = await verify(jwt, PUBLIC_LICENSE_KEY_V3);

		return JSON.stringify(payload);
	}

	const decrypted = crypto.publicDecrypt(
		Buffer.from(PUBLIC_LICENSE_KEY_V2, 'base64').toString('utf-8'),
		Buffer.from(encrypted, 'base64')
	);

	return decrypted.toString('utf-8');
}
