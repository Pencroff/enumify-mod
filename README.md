# enumify-mod

A JavaScript / TypeScript library for enums - mod of Enumify.

### Install

```
npm i enumify-mod --save
```

### Features

 - **[enumify](https://github.com/rauschma/enumify)** implementation in typescript
 - Support `valueOf` method
 ```javascript
    const Color = Enum.create('Color', ['RED', 'GREEN', 'BLUE']);
    Color.GREEN.valueOf() === 1 // true
 ```
 - Support `fromValue` method
 ```javascript
    const Color = Enum.create('Color', {
      RED: '#F00',
      GREEN: '#0F0',
      BLUE: {
        alias: 'blue',
      },
    });
    Color.fromValue('#0F0') === Color.GREEN // true
    Color.fromValue(2) === Color.BLUE // true
 ```
 - Support `fromName` method
 ```javascript
    Color.fromName('GREEN') === Color.GREEN // true
    Color.fromName('BLUE') === Color.BLUE // true
 ```
 - Require repeating all values for avoiding creating additional type
 ```
    class YesNoEnum extends Enum {
      static YES;
      static NO;
    }
    YesNoEnum.initEnum({
      YES: true,
      NO: false
    });
    YesNoEnum.YES.valueOf() === true // true
 ```

### NPM scripts

 - `npm t`: Run test suite
 - `npm start`: Runs `npm run build` in watch mode
 - `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
 - `npm run test:prod`: Run linting and generate coverage
 - `npm run build`: Generage bundles and typings, create docs
 - `npm run lint`: Lints code
 - `npm run commit`: Commit using conventional commit style ([husky](https://github.com/typicode/husky) will tell you to use it if you haven't :wink:)

### Thanks

[@alexjoverm](https://twitter.com/alexjoverm) for nice [TypeScript library starter](https://github.com/alexjoverm/typescript-library-starter)

