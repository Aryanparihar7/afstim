import * as readline from "node:readline";

import pc from "picocolors";

// picocolors already no-ops every color function when NO_COLOR is set
// or output isn't a TTY, so respecting NO_COLOR is automatic as long as
// all color goes through it rather than raw ANSI codes.
export function printSuccess(message: string): void {
  console.log(pc.green(message));
}

export function missionLine(order: number, title: string): string {
  return `▸ Mission ${order} — ${title}`;
}

export function passLine(label: string): string {
  return pc.green(`✓ ${label}`);
}

export function failLine(label: string, reason: string): string {
  return `${pc.red(`✗ ${label}`)}\n  ${reason}`;
}

export class CancelledError extends Error {}

const CTRL_C = "";
const BACKSPACE = "";

/**
 * Reads a line from stdin without echoing it back — for pasting a
 * token. Falls back to a plain (unmasked) prompt when stdin isn't a
 * TTY, so the CLI doesn't crash in a non-interactive context.
 */
export function promptMasked(question: string): Promise<string> {
  if (!process.stdin.isTTY) {
    return promptPlain(question);
  }

  return new Promise((resolve, reject) => {
    process.stdout.write(question);
    process.stdin.resume();
    process.stdin.setRawMode(true);
    process.stdin.setEncoding("utf8");

    let input = "";

    function cleanup() {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.removeListener("data", onData);
    }

    function onData(chunk: string) {
      for (const char of chunk) {
        if (char === "\r" || char === "\n") {
          cleanup();
          process.stdout.write("\n");
          resolve(input);
          return;
        }
        if (char === CTRL_C) {
          cleanup();
          process.stdout.write("\n");
          reject(new CancelledError());
          return;
        }
        if (char === BACKSPACE || char === "\b") {
          input = input.slice(0, -1);
          continue;
        }
        input += char;
      }
    }

    process.stdin.on("data", onData);
  });
}

function promptPlain(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}
