import { expect, test } from 'vitest';
import min from './min';

test('Rule "min" should pass with valid input', () => {
  const validate = min({ value: 10 });

  expect(validate(10)).toBe(true);
  expect(validate('_'.repeat(10))).toBe(true);
  expect(validate(Array.from('_'.repeat(10)))).toBe(true);
});

test('Rule "min" should fail with invalid input', () => {
  const validate = min({ value: 10 });

  expect(validate(undefined)).toBe(false);
  expect(validate(9)).toBe(false);
  expect(validate('_'.repeat(9))).toBe(false);
  expect(validate(Array.from('_'.repeat(9)))).toBe(false);
});
