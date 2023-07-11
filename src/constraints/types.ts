import { Activity, Competition, Person } from '@wca/helpers';

export interface Constraint {
  /** Unique Identifying name of constraint */
  name: string;
  /**
   *
   * @param wcif
   * @param activity
   * @param assignmentCode
   * @param person
   * @returns
   * - null if the person should not be assigned to the activity + assignmentCode
   * - a number to indicate how good of a fit the person is for the activity + assignmentCode. Higher scores are better
   *
   *
   * examples:
   * - the person already has a competitor assignment for the round, return null
   * - the person needs a competitor aassignment but there are 2 people with the same firstname in the activity, return a low score
   */
  score: (
    wcif: Competition,
    activity: Activity,
    assignmentCode: string,
    person: Person
  ) => number | null;
}
