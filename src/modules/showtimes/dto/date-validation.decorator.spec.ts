import { IsAfterDateConstraint } from './date-validation.decorator';
import { ValidationArguments } from 'class-validator';

describe('IsAfterDateConstraint', () => {
  let constraint: IsAfterDateConstraint;

  beforeEach(() => (constraint = new IsAfterDateConstraint()));

  describe('validate', () => {
    it('should return true when end date is after start date', () => {
      const startDate = new Date('2025-01-01T10:00:00Z');
      const endDate = new Date('2025-01-01T12:00:00Z');

      const args = {
        constraints: ['startTime'],
        object: { startTime: startDate },
        property: 'endTime',
        targetName: 'TestClass',
        value: endDate,
      } as ValidationArguments;

      expect(constraint.validate(endDate, args)).toBeTruthy();
    });

    it('should return false when end date is before start date', () => {
      const startDate = new Date('2025-01-01T12:00:00Z');
      const endDate = new Date('2025-01-01T10:00:00Z');

      const args = {
        constraints: ['startTime'],
        object: { startTime: startDate },
        property: 'endTime',
        targetName: 'TestClass',
        value: endDate,
      } as ValidationArguments;

      expect(constraint.validate(endDate, args)).toBeFalsy();
    });

    it('should return true when either date is missing', () => {
      const startDate = new Date('2025-01-01T10:00:00Z');

      const argsNoEnd = {
        constraints: ['startTime'],
        object: { startTime: startDate },
        property: 'endTime',
        targetName: 'TestClass',
        value: null,
      } as ValidationArguments;

      const argsNoStart = {
        constraints: ['startTime'],
        object: { startTime: null },
        property: 'endTime',
        targetName: 'TestClass',
        value: startDate,
      } as ValidationArguments;

      expect(constraint.validate(null, argsNoEnd)).toBeTruthy();
      expect(constraint.validate(startDate, argsNoStart)).toBeTruthy();
    });
  });

  describe('defaultMessage', () => {
    it('should return appropriate error message', () => {
      const args = {
        constraints: ['startTime'],
        object: {},
        property: 'endTime',
        targetName: 'TestClass',
        value: new Date(),
      } as ValidationArguments;

      const message = constraint.defaultMessage(args);
      expect(message).toBe('endTime must be later than startTime');
    });
  });
});
