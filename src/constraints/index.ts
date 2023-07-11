/**
 * Example constraints:
 * - A person can only have one competitor assignment per round.
 * - A person must have a staff assignment for each round they have a competitor assignment.
 * - A person can't have 2 assignments at the same time.
 * - A person can't be assigned with another arbitrary person.
 * - A person can't be assigned in the same group as another person with the same name
 *
 */
export * from './util';
export * from './createUniqueAssignment';
export * from './mustBeInRound';
export * from './balancedGroupSize';
export * from './spreadDelegates';
export * from './balancedSpeed';
export * from './mustNotHaveOtherAssignments';
export * from './types';
