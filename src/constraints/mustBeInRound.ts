import { parseActivityCode } from '@wca/helpers';
import { createConstraint } from './util';

/**
 * Creates a constraint that ensures that a person is in the round for a given activity.
 * @param eventId
 * @returns
 */
export const mustBeInRoundConstraint = (constraintAssignmentCode: string) =>
  createConstraint(
    `must_be_in_round_for_${constraintAssignmentCode}`,
    (wcif, activity, assignmentCode, person) => {
      // If the assignment codes aren't the same, don't run this generator.
      if (assignmentCode !== constraintAssignmentCode) {
        return 0;
      }

      const { eventId, roundNumber } = parseActivityCode(activity.activityCode);

      // If the person is registered for the event, allow them.
      if (
        roundNumber === 1 &&
        person.registration?.eventIds?.includes(eventId)
      ) {
        return 0;
      }

      const roundId = `${eventId}-r${roundNumber}`;

      const event = wcif.events.find((event) => event.id === eventId);
      const round = event?.rounds?.find((round) => round.id === roundId);

      if (
        round?.results.some((result) => result.personId === person.registrantId)
      ) {
        return 0;
      }

      // If the person is not registered for the event, don't allow them.
      return null;
    }
  );
