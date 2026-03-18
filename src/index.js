import chalk from 'chalk';
import ora from 'ora';
import { loadPreferences, savePreferences, formatStackSummary } from './preferences.js';
import { askProjectName, askStackMode, askFullStack } from './prompts.js';
import { generateProject } from './generator.js';

export async function run() {
  console.log('\n' + chalk.bold.blue('◆ Stackr') + chalk.gray(' — scaffold your stack, your way\n'));

  try {
    const projectName = await askProjectName();
    const saved = loadPreferences();
    let stack;

    if (saved) {
      const summary = formatStackSummary(saved);
      const mode = await askStackMode(summary);

      if (mode === 'same') {
        stack = saved;
      } else {
        stack = await askFullStack();
        savePreferences(stack);
      }
    } else {
      console.log(chalk.gray("First time? Let's set up your stack.\n"));
      stack = await askFullStack();
      savePreferences(stack);
    }

    console.log('');
    const spinner = ora(`Creating ${chalk.bold(projectName)}...`).start();

    await generateProject(projectName, stack);

    spinner.succeed(chalk.green(`Project created: ${projectName}/`));

    console.log('\n' + chalk.bold('Next steps:'));
    console.log(chalk.gray(`  cd ${projectName}`));
    console.log(chalk.gray('  npm install'));
    console.log(chalk.gray('  npm run dev'));
    console.log('\n' + chalk.blue('Happy building 🚀') + '\n');

  } catch (err) {
    if (err.name === 'ExitPromptError') {
      console.log('\n' + chalk.gray('Cancelled.') + '\n');
      process.exit(0);
    }
    console.error('\n' + chalk.red('Error: ') + err.message + '\n');
    process.exit(1);
  }
}
