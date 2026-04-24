import chalk from 'chalk';
import ora from 'ora';
import { generateProject } from './generator.js';
import { loadProfiles, saveProfile } from './preferences.js';
import { askFullStack, askProfileName, askProfileSelection, askProjectName } from './prompts.js';

export async function run() {
  console.log('\n' + chalk.bold.blue('◆ Stackr Ultimate') + chalk.gray(' — scaffold your stack, your way (Open Source)\n'));

  try {
    const projectName = await askProjectName();
    const profiles = loadProfiles();
    const hasProfiles = Object.keys(profiles).length > 0;
    
    let stack;

    if (hasProfiles) {
      const choice = await askProfileSelection(profiles);
      
      if (choice === 'new') {
        stack = await askFullStack();
        const profileName = await askProfileName();
        saveProfile(profileName, stack);
        console.log(chalk.green(`\n✓ Profile "${profileName}" saved for future use.`));
      } else {
        stack = choice; // Usa el perfil seleccionado
      }
    } else {
      console.log(chalk.gray("First time? Let's set up your first stack profile.\n"));
      stack = await askFullStack();
      const profileName = await askProfileName();
      saveProfile(profileName, stack);
      console.log(chalk.green(`\n✓ Profile "${profileName}" saved for future use.`));
    }

    console.log('');
    const spinner = ora(
      `Creating ${chalk.bold(projectName)}` + chalk.cyan(' (Optimizing with latest versions...)') + `...`
    ).start();

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