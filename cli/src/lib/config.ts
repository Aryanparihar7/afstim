import { chmod, mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

export type CliConfig = {
  token: string;
  apiUrl: string;
  email: string;
};

const CONFIG_DIR = join(homedir(), ".afstim");
const CONFIG_PATH = join(CONFIG_DIR, "config.json");

export async function readConfig(): Promise<CliConfig | null> {
  try {
    const raw = await readFile(CONFIG_PATH, "utf8");
    return JSON.parse(raw) as CliConfig;
  } catch {
    return null;
  }
}

// `mode` on writeFile only applies when the file is first created, so a
// re-login overwriting an existing config re-asserts 0600 explicitly
// rather than trusting whatever the file already had.
export async function writeConfig(config: CliConfig): Promise<void> {
  await mkdir(CONFIG_DIR, { recursive: true, mode: 0o700 });
  await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), { mode: 0o600 });
  await chmod(CONFIG_PATH, 0o600);
}
