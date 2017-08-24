/**
 * Created by Sergey Daniloff on 23-Aug-2017.
 * Based on enumify idea - https://github.com/rauschma/enumify and proposal http://goo.gl/XCh8Lc
 */

const INITIALIZED = Symbol();

export type EnumArgType = any[] | object;

/**
 * This is an abstract class that is not intended to be
 * used directly. Extend it to turn your class into an enum
 * (initialization is performed via `MyClass.initEnum()`).
 */
export class Enum {
  public static enumValues: any;
  public name: string;

  /**
   * `initEnum()` closes the class. Then calling this constructor
   * throws an exception.
   *
   * If your subclass has a constructor then you can control
   * what properties are added to `this` via the argument you
   * pass to `super()`. No arguments are fine, too.
   */
  constructor(instanceProperties: object) {
    // new.target would be better than this.constructor,
    // but isn’t supported by Babel
    if ({}.hasOwnProperty.call(this.constructor, INITIALIZED)) {
      throw new Error('Enum classes can’t be instantiated');
    }
    if (typeof instanceProperties === 'object' && instanceProperties !== null) {
      copyProperties(this, instanceProperties);
    }
  }

  /**
   * Create new Enum by name and description
   * @param {string} enumName, enum name, used in `toString`
   * @param {EnumArgType} arg Describing new fields of enum
   * @returns {any}
   */
  public static create(enumName: string, arg: EnumArgType): any {
    const newEnum = class extends Enum {};
    newEnum.prototype.constructor = new Function(
      `return function ${enumName}() {}`
    )();
    return newEnum.initEnum(arg);
  }
  /**
   * Set up the enum, close the class.
   *
   * @param arg Either an object whose properties provide the names
   * and values (which must be mutable objects) of the enum constants.
   * Or an Array whose elements are used as the names of the enum constants
   * The values are create by instantiating the current class.
   */
  public static initEnum(arg: EnumArgType) {
    Object.defineProperty(this, 'enumValues', {
      value: [],
      configurable: false,
      writable: false,
      enumerable: true,
    });
    if (Array.isArray(arg)) {
      this._enumValuesFromArray(arg, this); // Typescript not support ES6 version
    } else {
      this._enumValuesFromObject(arg);
    }
    Object.freeze(this.enumValues);
    let ctx: any = this;
    ctx[INITIALIZED] = true;
    return ctx;
  }

  /**
   * Get Enum instance by value
   * @param value
   */
  public static fromValue(value: any) {
    return this.enumValues.find((x: any) => x.value === value);
  }

  /**
   * Get Enum instance by name
   * @param {string} name
   */
  public static fromName(name: string) {
    return this.enumValues.find((x: any) => x.name === name);
  }

  /**
   * Make enum classes iterable
   */
  public static [Symbol.iterator]() {
    return this.enumValues[Symbol.iterator]();
  }

  private static _enumValuesFromArray(arr: any[], context: any) {
    for (const key of arr) {
      this._pushEnumValue(new context(), key);
    }
  }

  private static _enumValuesFromObject(obj: any) {
    Object.keys(obj).forEach((key: string) => {
      let keyValue = obj[key];
      if (typeof keyValue !== 'object') {
        keyValue = {
          value: obj[key],
        };
      }
      const value = new this(keyValue);
      this._pushEnumValue(value, key);
    });
  }

  private static _pushEnumValue(enumValue: any, name: string) {
    enumValue.name = name;
    if (typeof enumValue.value === 'undefined') {
      enumValue.value = this.enumValues.length;
    }
    enumValue.valueOf = function valueOf() {
      return this.value;
    };
    Object.defineProperty(this, name, {
      value: enumValue,
      configurable: false,
      writable: false,
      enumerable: true,
    });
    this.enumValues.push(enumValue);
  }

  /**
   * Default `toString()` method for enum constant.
   */
  public toString() {
    return `${this.constructor.name}.${this.name}`;
  }
}
function copyProperties(target: object, source: object) {
  // Ideally, we’d use Reflect.ownKeys() here,
  // but I don’t want to depend on a polyfill
  for (const key of Object.getOwnPropertyNames(source)) {
    const desc = Object.getOwnPropertyDescriptor(source, key);
    Object.defineProperty(target, key, desc);
  }
  return target;
}
