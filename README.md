# Nightwatch Extended JUnit Reporter

This Nightwatch reporter is a extension of the base JUnit reporter. It includes a base64 encoded string of the failure image and also the test steps. The format for this JUnit was inspired by [this](https://github.com/testmoapp/junitxml) reference guide.

> If you use this reporter do not use the base JUnit reporter included with Nightwatch.

You can see and example JUnit report in the [examples](https://github.com/simonwang384/nightwatch-extended-junit-reporter/blob/main/examples/) folder.

## Installation

```sh
npm install nightwatch-extended-junit-reporter
```

## Usage

To use the reporter all you need to do is include `reporter=nightwatch-extended-junit-reporter` when running `nightwatch`.

## Contributing

You can open a PR against this repository to contribute! :smile:

When making a PR please follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). This allows us to keep commits nice and organized.

## Helpful Links

- [Nightwatch](https://nightwatchjs.org/)
- [Nightwatch Custom Reporter Guide](https://nightwatchjs.org/guide/reporters/create-custom-reporter.htmls)
- [Base Nightwatch JUnit Reporter](https://github.com/nightwatchjs/nightwatch/blob/main/lib/reporter/reporters/junit.js)
