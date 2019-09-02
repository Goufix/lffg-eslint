import { GluegunToolbox } from 'gluegun';

module.exports = {
  name: 'install',
  description: `Usage: lffg-eslint install

this command will install the lffg eslint config in your project.`,
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: {
        spin,
        success,
        colors: { blue, bold }
      },
      system: { run },
      filesystem,
      prompt,
      template
    } = toolbox;

    const isProject = await filesystem.exists('./package.json');
    const haveEslint = await filesystem.exists('./.eslintrc.json');
    const hasYarn = await filesystem.exists('./yarn.lock');
    // const hasNpm = await filesystem.exists('package-lock.json');

    if (isProject) {
      if (haveEslint) {
        const eslintReplace = await prompt.confirm(
          'You already have an eslint config in your project. Are you sure that you want to subscribe this config?'
        );
        if (!eslintReplace) return;
      }

      const installing = spin(
        blue(bold(`Installing using ${hasYarn ? 'Yarn' : 'npm'}...`))
      );
      installing.start();
      // const npmOrYarn = await prompt.ask({
      //   type: 'select',
      //   name: 'npmOrYarn',
      //   message: 'Do you want to use YARN or NPM to install packages?',
      //   choices: ['YARN', 'NPM']
      // });
      const installEslint = hasYarn
        ? 'yarn add eslint-config-lffg'
        : 'npm i eslint-config-lffg';
      await run(installEslint);
      installing.succeed('eslint-config-lffg installed!');
      await template.generate({
        template: '.eslintrc.json.ejs',
        target: './.eslintrc.json'
      });
      success(bold('Done!'));
    }
  }
};
