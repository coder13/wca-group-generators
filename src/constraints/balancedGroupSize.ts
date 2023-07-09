import { createConstraint } from './util';

/**
 * Creates a constraint that ensures that group sizes stay balanced.
 * @param assignmentCode
 * @returns
 */
export const balancedGroupSize = (assignmentCode: string) =>
  createConstraint(
    `Balanced_group_size_for_${assignmentCode}`,
    (wcif, activity, assignmentCode) => {
      // Higher is better so we return negative numbers to prefer smaller groups.
      return (
        -wcif.persons.filter((person) =>
          person.assignments?.some(
            (assignment) =>
              assignment.assignmentCode === assignmentCode &&
              assignment.activityId === activity.id
          )
        ).length || 0
      );
    }
  );
