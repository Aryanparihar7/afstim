#!/usr/bin/env node
import { Command } from "commander";
import { checkCommand } from "./commands/check.js";
import { loginCommand } from "./commands/login.js";
import { statusCommand } from "./commands/status.js";
const program = new Command();
program.name("afstim").description("The Afstim CLI.").version("0.1.0");
program
    .command("login")
    .description("Log in with a token from https://afstim.com/settings/cli")
    .action(loginCommand);
program
    .command("status")
    .description("Show your current mission and progress")
    .action(statusCommand);
program
    .command("check")
    .description("Check your work against your current mission")
    .action(checkCommand);
program.parseAsync(process.argv);
