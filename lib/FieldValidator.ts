import { Checker, Conditions, FieldValidatorArguments, Locales, Message, Messages, Rule, RuleArguments, Rules } from './types';
import { formatString, isEmpty } from './utils';

class FieldValidator {
  private name: string;

  private locale: string;

  private locales: Locales;

  private rules: Rules;

  private checkers: Checker[] = [];

  private conditions: Conditions = {};

  private shouldSkip: boolean = false;

  constructor({
    name,
    locale,
    locales,
    rules,
  }: FieldValidatorArguments) {
    this.name = name;
    this.locale = locale;
    this.locales = locales;
    this.rules = rules;
  }

  private buildChecker(ruleName: string, args: RuleArguments): Checker {
    const rule = this.getRule(ruleName)(args);
    const message = this.getMessage(ruleName)(this.name.toLowerCase(), args);
    return (input: unknown) => {
      if (ruleName !== this.required.name && isEmpty(input)) return true;
      if (rule(input)) return true;
      if (typeof message === 'object') {
        const inputType =  Object.prototype.toString.call(input).toLowerCase().slice(8, -1);
        if (!(inputType in message)) {
          throw new Error(`The message for the "${ruleName}" rule of the "${inputType}" type is missing.`);
        }
        return formatString(message[inputType]);
      }
      return formatString(message);
    };
  }

  private pushChecker(ruleName: string, args: RuleArguments): this {
    if (ruleName in this.conditions && !this.conditions[ruleName]) return this;
    const checker = this.buildChecker(ruleName, args);
    this.checkers.push(checker);
    return this;
  }

  public get messages(): Messages {
    if (!(this.locale in this.locales)) {
      throw new Error(`The messages for the "${this.locale}" locale are missing.`);
    }
    return this.locales[this.locale];
  }

  public getRule(name: string): Rule {
    if (!(name in this.rules)) {
      throw new Error(`The "${name}" rule does not exist.`);
    }
    return this.rules[name];
  }

  public getMessage(ruleName: string): Message {
    if (!(ruleName in this.messages)) {
      throw new Error(`The message for the "${ruleName}" rule is missing.`);
    }
    return this.messages[ruleName];
  }

  public validate(value: unknown): boolean | string {
    if (this.shouldSkip) return true;
    for (const checker of this.checkers) {
      const result = checker(value);
      if (typeof result === 'string') {
        return result;
      }
    }
    return true;
  }

  public collect(): Checker[] {
    return this.shouldSkip ? [] : this.checkers;
  }

  public apply(ruleName: string, args?: RuleArguments): this {
    return this.pushChecker(ruleName, args || {});
  }

  public alphaDash(): this {
    return this.apply(this.alphaDash.name);
  }

  public alphaDashDot(): this {
    return this.apply(this.alphaDashDot.name);
  }

  public between(min: number, max: number): this {
    return this.apply(this.between.name, { min, max });
  }

  public email(): this {
    return this.apply(this.email.name);
  }

  public endsWith(values: string[] | string): this {
    return this.apply(this.endsWith.name, { values });
  }

  public in(values: string[]): this {
    return this.apply(this.in.name, { values });
  }

  public lowercase(): this {
    return this.apply(this.lowercase.name);
  }

  public max(value: number): this {
    return this.apply(this.max.name, { max: value });
  }

  public min(value: number): this {
    return this.apply(this.min.name, { min: value });
  }

  public notIn(values: string[]): this {
    return this.apply(this.notIn.name, { values });
  }

  public required(): this {
    return this.apply(this.required.name);
  }

  public startsWith(values: string[] | string): this {
    return this.apply(this.startsWith.name, { values });
  }

  public unique(values: string[], ignores: unknown[] | unknown = []): this {
    return this.apply(this.unique.name, { values, ignores });
  }

  public uppercase(): this {
    return this.apply(this.uppercase.name);
  }

  public url(): this {
    return this.apply(this.url.name);
  }

  public when(conditions: boolean | Conditions): this {
    if (typeof conditions === 'object') {
      this.conditions = conditions;
      return this;
    }
    if (!conditions) {
      this.shouldSkip = true;
    }
    return this;
  }
}

export default FieldValidator;
