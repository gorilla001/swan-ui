# frontend

DataMan frontend allin


# js 代码风格

angular-styleguide - https://github.com/johnpapa/angular-styleguide

# Running Unit Tests
The Frontendapp comes preconfigured with unit tests. These are written in
[Jasmine][jasmine], which we run with the [Karma Test Runner][karma]. We provide a Karma
configuration file to run them.

* the configuration is found at `karma.conf.js`
* the unit tests are found next to the code they are testing and are named as `xxx.spec.js`.

The easiest way to run the unit tests is to use the supplied npm script:

```
npm test
```

## Setup
``` npm install ```

``` webdriver-manager update ```

``` webdriver-manager start ```

## Run the test
```npm test```
```npm test-single```
