import { hash, verify } from "@node-rs/argon2";

// No explicit `algorithm` option: Argon2id is the library's default.

// A password nobody will ever type, hashed once and reused so that checking
// a nonexistent user costs the same Argon2id verify() time as checking a
// real one with a wrong password. Without this, "no such user" would return
// near-instantly while "wrong password" pays the full hash cost — a timing
// side-channel that lets an attacker enumerate which emails are registered.
let dummyHash: Promise<string> | undefined;
function getDummyHash(): Promise<string> {
  dummyHash ??= hash("afstim-dummy-password-for-timing-safety");
  return dummyHash;
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password);
}

/**
 * Verifies a password against a stored hash. Pass `null` for `storedHash`
 * when no user was found — this still runs a full Argon2id verify against a
 * dummy hash, so "no such user" and "wrong password" take identical time
 * and both simply return `false`.
 */
export async function verifyPassword(
  password: string,
  storedHash: string | null
): Promise<boolean> {
  if (!storedHash) {
    await verify(await getDummyHash(), password);
    return false;
  }
  return verify(storedHash, password);
}
