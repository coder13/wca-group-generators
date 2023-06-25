/**
 * Example constraints:
 * - A person can only have one competitor assignment per round.
 * - A person must have a staff assignment for each round they have a competitor assignment.
 * - A person can't have 2 assignments at the same time.
 * - A person can't be assigned with another arbitrary person.
 * - A person can't be assigned in the same group as another person with the same name
 *
 */

import { Activity, Competition, Person, parseActivityCode } from '@wca/helpers';
import { allChildActivitiesInRoom, rooms } from './activities';

export interface Constraint {
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

/**
 * Creates a constraint that ensures that a person has one assignmentCode the round the activity is for.
 * @param assignmentCode
 * @returns
 */
export const createUniqueAssignmentConstraint = (assignmentCode: string) =>
  createConstraint(
    `unique_${assignmentCode}_per_round`,
    (wcif, activity, assignmentCode, person) => {
      const { eventId, roundNumber, attemptNumber } = parseActivityCode(
        activity.activityCode
      );

      const allActivitiesForRoundAttempt = rooms(wcif)
        .flatMap((room) => allChildActivitiesInRoom(room))
        .filter((activity) => {
          const {
            eventId: activityEventId,
            roundNumber: activityRoundNumber,
            attemptNumber: activityAttemptNumber,
          } = parseActivityCode(activity.activityCode);
          return (
            eventId === activityEventId &&
            roundNumber === activityRoundNumber &&
            attemptNumber === activityAttemptNumber
          );
        });

      const assignments =
        person.assignments?.filter(
          (assignment) => assignment.assignmentCode === assignmentCode
        ) || [];

      if (
        assignments.some((assignment) =>
          allActivitiesForRoundAttempt.some(
            (activity) => activity.id === assignment.activityId
          )
        )
      ) {
        return null;
      }
      return 0;
    }
  );
