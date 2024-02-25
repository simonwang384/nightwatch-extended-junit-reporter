const BaseReporter = require('nightwatch/lib/reporter/base-reporter')
const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
const stripAnsi = require('strip-ansi');

class ExtendedJunitReporter extends BaseReporter {
  __tmplData__ = ''

  get templateFile() {
    return path.join(__dirname, 'junit.xml.ejs');
  }

  set tmplData(val) {
    this.__tmplData__ = val;
  }

  get tmplData() {
    return this.__tmplData__;
  }

  loadTemplate() {
    return new Promise((resolve, reject) => {
      if (this.tmplData) {
        return resolve(this.tmplData);
      }

      fs.readFile(this.templateFile, (err, data) => {
        if (err) {
          return reject(err);
        }

        this.tmplData = data.toString();
        resolve(this.tmplData);
      });
    });
  }

  writeReport(moduleKey, template) {
    const module = this.results.modules[moduleKey];
    const pathParts = moduleKey.split(path.sep);
    const moduleName = pathParts.pop();
    let className = moduleName;
    let output_folder = this.options.output_folder;
    let shouldCreateFolder = false;

    this.adaptAssertions(module);

    if (pathParts.length) {
      output_folder = path.join(output_folder, pathParts.join(path.sep));
      className = pathParts.join('.') + '.' + moduleName;
      shouldCreateFolder = true;
    }

    const filename = path.join(output_folder, `${module.reportPrefix}${moduleName}.xml`);
    const report = {
      module,
      moduleName,
      className,
      systemerr: this.results.errmessages.map(item => stripAnsi(item)).join('\n'),
      fs: fs
    };

    let rendered = ejs.render(template, report);
    rendered = this.stripControlChars(rendered);

    return this.writeReportFile(filename, rendered, shouldCreateFolder, output_folder)
  }

  write() {
    const keys = Object.keys(this.results.modules);

    return this.loadTemplate()
      .then(template => {
        const promises = keys.map(moduleKey => {
          return this.writeReport(moduleKey, template);
        });

        return Promise.all(promises);
      });
  }

  stripControlChars(input) {
    return input && input.replace(
      /[\x00-\x09\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g,
      ''
    );
  }
}

module.exports = {
  write: function (results, options, done) {

    const envs = Object.keys(results.modulesWithEnv);
    const promises = envs.map(env => {
      const envResult = { ...results, modules: results.modulesWithEnv[env] };
      return new ExtendedJunitReporter(envResult, options).write();
    });

    Promise.all(promises)
      .then(_ => {
        done();
      })
      .catch(err => {
        done(err);
      });
  }
};