import { Activity, Competition, Person } from '@wca/helpers';
import { Constraint } from './types';

export const createConstraint = (
  name: string,
  score: (
    wcif: Competition,
    activity: Activity,
    assignmentCode: string,
    person: Person
  ) => number | null
): Constraint => {
  return {
    name,
    score,
  };
};
