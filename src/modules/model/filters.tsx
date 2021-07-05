import { enumType, inputObjectType } from 'nexus';

export const StringFilterMode = enumType({
  name: 'StringFilterMode',
  members: ['default', 'insensitive'],
});

export const StringFilter = inputObjectType({
  name: 'StringFilter',
  definition(t) {
    t.string('contains');
    t.string('endsWith');
    t.string('equals');
    t.string('gt');
    t.string('gte');
    t.list.string('in');
    t.string('lt');
    t.string('lte');
    t.field('mode', { type: StringFilterMode });
    t.field('not', { type: 'StringFilter' });
    t.list.string('notIn');
    t.string('startsWith');
  },
});

export const DecimalFilter = inputObjectType({
  name: 'DecimalFilter',
  definition(t) {
    t.decimal('equals');
    t.decimal('gt');
    t.decimal('gte');
    t.list.decimal('in');
    t.decimal('lt');
    t.decimal('lte');
    t.field('not', { type: 'DecimalFilter' });
    t.list.decimal('notIn');
  },
});

export const IntFilter = inputObjectType({
  name: 'IntFilter',
  definition(t) {
    t.int('equals');
    t.int('gt');
    t.int('gte');
    t.list.int('in');
    t.int('lt');
    t.int('lte');
    t.field('not', { type: 'IntFilter' });
    t.list.int('notIn');
  },
});

export const DateTimeFilter = inputObjectType({
  name: 'DateTimeFilter',
  definition(t) {
    t.dateTime('equals');
    t.dateTime('gt');
    t.dateTime('gte');
    t.list.dateTime('in');
    t.dateTime('lt');
    t.dateTime('lte');
    t.field('not', { type: 'DateTimeFilter' });
    t.list.dateTime('notIn');
  },
});

export const NetworkFilter = inputObjectType({
  name: 'NetworkFilter',
  definition(t) {
    t.field('equals', { type: 'Network' });
    t.list.field('in', { type: 'Network' });
    t.field('not', { type: 'NetworkFilter' });
    t.list.field('notIn', { type: 'Network' });
  },
});

export const PaymentStatusFilter = inputObjectType({
  name: 'PaymentStatusFilter',
  definition(t) {
    t.field('equals', { type: 'PaymentStatus' });
    t.list.field('in', { type: 'PaymentStatus' });
    t.field('not', { type: 'PaymentStatusFilter' });
    t.list.field('notIn', { type: 'PaymentStatus' });
  },
});
