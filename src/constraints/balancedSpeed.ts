import { parseActivityCode } from '@wca/helpers';
import { createConstraint } from './util';

/**
 * Creates a constraint that ensures that group speeds stay balanced.
 * @param assignmentCode
 * @returns
 */
export const balancedSpeed = (assignmentCode: string) =>
  createConstraint(
    `Balanced_group_speed_for_${assignmentCode}`,
    (wcif, activity, assignmentCode, person) => {
      const { eventId } = parseActivityCode(activity.activityCode);
      const peopleInActivity = wcif.persons.filter((person) =>
        person.assignments?.some(
          (assignment) =>
            assignment.assignmentCode === assignmentCode &&
            assignment.activityId === activity.id
        )
      );

      const sumOfPRs = [person, ...peopleInActivity].map((p) => {
        const PRs = p.personalBests?.filter((pb) => pb.eventId === eventId);

        const singlePr = PRs?.find((pb) => pb.type === 'single');
        if (['333bf', '444bf', '555bf', '333mbf'].includes(eventId)) {
          return singlePr?.worldRanking ?? 0;
        }

        const averagePr = PRs?.find((pb) => pb.type === 'average');

        return averagePr?.worldRanking ?? singlePr?.worldRanking ?? 0;
      });

      // Higher is better so we return negative numbers to prefer smaller groups.
      return -sumOfPRs.reduce((a, b) => a + b, 0);
    }
  );
