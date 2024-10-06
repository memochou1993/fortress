import { BetweenRuleArguments } from '~/rules/between';
import { EndsWitchRuleArguments } from '~/rules/endsWith';
import { MaxRuleArguments } from '~/rules/max';
import { MinRuleArguments } from '~/rules/min';
import { StartsWitchRuleArguments } from '~/rules/startsWith';
import { Messages } from '~/types';
import { formatNumber } from '~/utils';

const en: Messages = {
  alphaDash: (field) => `The ${field} field must only contain letters, numbers, dashes and underscores.`,
  alphaDashDot: (field) => `The ${field} field must only contain letters, numbers, dashes, underscores and dots.`,
  between: (field, { min, max }: BetweenRuleArguments) => ({
    array: `The ${field} field must be between ${formatNumber(min)} and ${formatNumber(max)} items.`,
    file: `The ${field} field must be between ${formatNumber(min)} and ${formatNumber(max)} kilobytes.`,
    number: `The ${field} field must be between ${formatNumber(min)} and ${formatNumber(max)}.`,
    string: `The ${field} field must be between ${formatNumber(min)} and ${formatNumber(max)} characters.`,
  }),
  email: (field) => `The ${field} field must be a valid email address.`,
  endsWith: (field, { values }: EndsWitchRuleArguments) => ({
    string: `The ${field} field must end with one of the following: ${values}.`,
  }),
  max: (field, { max }: MaxRuleArguments) => ({
    array: `The ${field} field must not be greater than ${formatNumber(max)} items.`,
    file: `The ${field} field must not be greater than ${formatNumber(max)} kilobytes.`,
    number: `The ${field} field must not be greater than ${formatNumber(max)}.`,
    string: `The ${field} field must not be greater than ${formatNumber(max)} characters.`,
  }),
  min: (field, { min }: MinRuleArguments) => ({
    array: `The ${field} field must be at least ${formatNumber(min)} items.`,
    file: `The ${field} field must be at least ${formatNumber(min)} kilobytes.`,
    number: `The ${field} field must be at least ${formatNumber(min)}.`,
    string: `The ${field} field must be at least ${formatNumber(min)} characters.`,
  }),
  required: (field) => `The ${field} field is required.`,
  startsWith: (field, { values }: StartsWitchRuleArguments) => ({
    // FIXME:
    string: `The ${field} field must start with one of the following: ${values}.`,
  }),
};

export default en;
