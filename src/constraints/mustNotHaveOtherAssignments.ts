import { createConstraint } from './util';

/**
 * Creates a constraint that requires the person to not have any other assignments in the activity.
 * @param assignmentCode
 * @returns
 */
export const mustNotHaveOtherAssignmentsConstraint = createConstraint(
  'must_not_have_other_assignments_in_activity',
  (_, activity, __, person) => {
    const assignments =
      person.assignments?.filter(
        (assignment) => assignment.activityId === activity.id
      ) || [];

    if (assignments?.length > 0) {
      return null;
    }

    return 0;
  }
);
