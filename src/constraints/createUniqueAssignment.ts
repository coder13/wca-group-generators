import { parseActivityCode } from '@wca/helpers';
import { createConstraint } from './util';
import { allChildActivitiesInRoom, rooms } from '../activities';

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
