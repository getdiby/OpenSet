import { Command } from 'commander';
import { readFileSync } from 'node:fs';
import chalk from 'chalk';
import { validate, countElements } from './index.js';

const program = new Command();

program
  .name('openset')
  .description('OpenSet CLI — validate training session and program documents')
  .version('1.0.0');

program
  .command('validate')
  .description('Validate one or more OpenSet JSON files')
  .argument('<files...>', 'JSON files to validate')
  .option('--verbose', 'Show detailed output for each file')
  .option('--summary', 'Show a summary of document structure')
  .option('--json', 'Output results as JSON')
  .action((files: string[], opts: { verbose?: boolean; summary?: boolean; json?: boolean }) => {
    let hasErrors = false;

    for (const file of files) {
      let doc: unknown;
      try {
        const raw = readFileSync(file, 'utf-8');
        doc = JSON.parse(raw);
      } catch (err: any) {
        console.error(chalk.red(`Failed to read/parse ${file}: ${err.message}`));
        hasErrors = true;
        continue;
      }

      const result = validate(doc);

      if (opts.json) {
        console.log(JSON.stringify({ file, ...result }, null, 2));
        if (!result.valid) hasErrors = true;
        continue;
      }

      console.log(chalk.bold(`\n${file}`));

      const d = doc as any;
      if (d.openset_version) {
        console.log(chalk.green(`  ✓ openset_version: ${d.openset_version}`));
      }
      if (d.type) {
        console.log(chalk.green(`  ✓ type: ${d.type}`));
      }

      if (opts.summary) {
        const counts = countElements(d);
        console.log(
          chalk.green(
            `  ✓ ${counts.blocks} block${counts.blocks !== 1 ? 's' : ''}, ` +
            `${counts.series} series, ` +
            `${counts.exercises} exercise${counts.exercises !== 1 ? 's' : ''}, ` +
            `${counts.sets} set${counts.sets !== 1 ? 's' : ''}`,
          ),
        );
      }

      if (result.errors.length > 0) {
        console.log(chalk.red(`\n  ERRORS (${result.errors.length}):`));
        for (const err of result.errors) {
          console.log(chalk.red(`    ${err.code}  ${err.path}`));
          console.log(chalk.red(`          ${err.message}`));
        }
      }

      if (result.warnings.length > 0) {
        console.log(chalk.yellow(`\n  WARNINGS (${result.warnings.length}):`));
        for (const warn of result.warnings) {
          console.log(chalk.yellow(`    ${warn.code}  ${warn.path}`));
          console.log(chalk.yellow(`          ${warn.message}`));
        }
      }

      if (result.valid) {
        console.log(chalk.green('\n  Result: VALID'));
      } else {
        console.log(chalk.red('\n  Result: INVALID'));
        hasErrors = true;
      }
    }

    process.exit(hasErrors ? 1 : 0);
  });

program.parse();
