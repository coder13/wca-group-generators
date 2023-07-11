import { createConstraint } from './util';

/**
 * Creates a constraint that ensures that group sizes stay balanced.
 * @param assignmentCode
 * @returns
 */
export const balancedGroupSize = createConstraint(
  'balanced_group_size',
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
