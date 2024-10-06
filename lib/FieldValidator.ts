import { Checker, Conditions, FieldValidatorArguments, Locales, Message, Messages, Rule, RuleArguments, Rules } from './types';
import { getType, isEmpty } from './utils';

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
    // FIXME: new a Checker
    return (value: unknown) => (ruleName !== this.required.name && isEmpty(value)) || rule(value) || (typeof message === 'object' ? message[getType(value)] : message);
  }

  private pushChecker(ruleName: string, args: RuleArguments): this {
    if (ruleName in this.conditions && !this.conditions[ruleName]) return this;
    const checker = this.buildChecker(ruleName, args);
    this.checkers.push(checker);
    return this;
  }

  public get messages(): Messages {
    if (!(this.locale in this.locales)) {
      throw new Error(`The messages for the locale "${this.locale}" are missing.`);
    }
    return this.locales[this.locale];
  }

  public getRule(name: string): Rule {
    if (!(name in this.rules)) {
      throw new Error(`The rule "${name}" does not exist.`);
    }
    return this.rules[name];
  }

  public getMessage(ruleName: string): Message {
    if (!(ruleName in this.messages)) {
      throw new Error(`The message for the rule "${ruleName}" is missing.`);
    }
    return this.messages[ruleName];
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

  public required(): this {
    return this.apply(this.required.name);
  }

  public alphaDash(): this {
    return this.apply(this.alphaDash.name);
  }

  public alphaDashDot(): this {
    return this.apply(this.alphaDashDot.name);
  }

  public max(value: number): this {
    return this.apply(this.max.name, { value });
  }

  public min(value: number): this {
    return this.apply(this.min.name, { value });
  }
}

export default FieldValidator;
