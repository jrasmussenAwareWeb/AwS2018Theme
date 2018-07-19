##
Boilerplate for creating new theme for you Sitecore site. 

## For using Autosynchronizer, you need to complete next steps:

1. Download theme boilerplate;
2. Put **z.SPE.Sync.Enabler.Gulp.config** to your instance of Sitecore. Path will be the next *PathToInstance/Website/App_Config/Include*. Example *C:\sitecore\Website\App_Config\Include*;
3. Switch back to downloaded theme boilerplate folder
4. Update config file for Gulp tasks. **ThemeRoot/gulp/config.js** file:
    1. `serverOptions.server` - path to sitecore instance. Example `server: 'http://sxa'`;
    2. `serverOptions.projectPath` - path to project, where theme placed. Example ` projectPath: '/themes'`;
    3. `serverOptions.themePath` - path to basic theme folder from project root. Example ` themePath: '/Basic'`;
    4. For Basic Theme the path is `/themes/Basic`
5. Open Theme root folder with command line.
6. Run `npm install` (*node.js and npm should be already installed*);
7. If gulp is not yet installed - Install gulp using following command: `npm install --global gulp-cli` 
8. Run gulp task which you need:
    1. `gulp default` - starts `all-watch`.
    2. `gulp sassComponents` - to compile sass styles just for components.
    3. `gulp sassStyles` - to compile sass additional styles for component.
    4. `gulp all-watch` - to watch on file changes for auto compiling and uploading.
    5. `gulp spriteFlag` - to create sprite for flags.
    6. `gulp css-watch` - to watch on style changes under **styles** folder.
    7. `gulp img-watch` - to watch on images changes under **images** folder.
    8. `gulp js-watch` - to watch on js changes under **scripts** folder.
    9. `gulp sass-watch` - to watch on sass changes under **sass** folder.
9. When watcher starts you need to enter you login and password for sitecore, for uploading reason.

