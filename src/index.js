import chalk from 'chalk';
import ora from 'ora';
import { loadProfiles, saveProfile, formatStackSummary } from './preferences.js';
import { askProjectName, askProfileMode, askProfileName, askManageProfiles, askFullStack } from './prompts.js';
import { generateProject } from './generator.js';

export async function run() {
  console.log('\n' + chalk.bold.blue('◆ Stackr Ultimate') + chalk.gray(' — scaffold your stack, your way\n'));

  try {
    const projectName = await askProjectName();
    const profiles = loadProfiles();
    const profileNames = Object.keys(profiles);

    let stack;
    let profileName;

    if (profileNames.length === 0) {
      // Primera vez — setup directo
      console.log(chalk.gray("First time? Let's set up your first profile.\n"));
      stack = await askFullStack();
      profileName = await askProfileName([]);
      saveProfile(profileName, stack);
      console.log('\n' + chalk.green(`✓ Profile "${profileName}" saved.`) + '\n');
    } else {
      // Tiene perfiles — mostrar opciones
      const result = await askProfileMode();

      if (result.mode === 'manage') {
        await askManageProfiles();
        // Volver a preguntar después de gestionar
        const result2 = await askProfileMode();
        if (result2.mode === 'use') {
          stack = profiles[result2.profileName];
          profileName = result2.profileName;
        } else {
          stack = await askFullStack();
          profileName = await askProfileName(Object.keys(loadProfiles()));
          saveProfile(profileName, stack);
          console.log('\n' + chalk.green(`✓ Profile "${profileName}" saved.`) + '\n');
        }
      } else if (result.mode === 'use') {
        stack = profiles[result.profileName];
        profileName = result.profileName;
      } else {
        // Nueva
        stack = await askFullStack();
        profileName = await askProfileName(profileNames);
        saveProfile(profileName, stack);
        console.log('\n' + chalk.green(`✓ Profile "${profileName}" saved.`) + '\n');
      }
    }

    const summary = formatStackSummary(stack);
    const hasCustomVersions = stack.versions && Object.keys(stack.versions).length > 0;

    console.log('');
    const spinner = ora(
      `Creating ${chalk.bold(projectName)} with ${chalk.blue(summary)}${hasCustomVersions ? chalk.gray(' (custom versions)') : chalk.gray(' (latest versions)')}...`
    ).start();

    await generateProject(projectName, stack);

    spinner.succeed(chalk.green(`Project created: ${projectName}/`));

    const devCmd = ['node-cli'].includes(stack.framework) ? 'npm start' : 'npm run dev';

    console.log('\n' + chalk.bold('Next steps:'));
    console.log(chalk.gray(`  cd ${projectName}`));
    console.log(chalk.gray('  npm install'));
    console.log(chalk.gray(`  ${devCmd}`));
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
