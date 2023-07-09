import { createConstraint } from './util';

/**
 * Creates a constraint that spreads out delegates by group numbers.
 * @param assignmentCode
 * @returns
 */
export const balancedGroupSize = (assignmentCode: string) =>
  createConstraint(
    `Spread_Delegates_${assignmentCode}`,
    (wcif, activity, assignmentCode) => {
      // Higher is better so we return negative numbers to prefer smaller groups.
      return (
        -wcif.persons.filter(
          (person) =>
            (person.roles?.includes('delegate') ||
              person.roles?.includes('trainee-delegate')) &&
            person.assignments?.some(
              (assignment) =>
                assignment.assignmentCode === assignmentCode &&
                assignment.activityId === activity.id
            )
        ).length || 0
      );
    }
  );
