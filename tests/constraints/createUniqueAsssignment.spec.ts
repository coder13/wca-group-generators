import { Activity, Competition, Person } from '@wca/helpers';
import { createUniqueAssignmentConstraint } from '../../src/constraints';

import wcif from '../mocks/BothellSummer2023.json';
import { getActivityFromCode } from '../util';

const uniqueCompetitorAssignmentConstraint =
  createUniqueAssignmentConstraint('competitor');

const activity_333r1g1 = getActivityFromCode(
  wcif as Competition,
  '333-r1-g1'
) as Activity;
const activity_333r1g2 = getActivityFromCode(
  wcif as Competition,
  '333-r1-g2'
) as Activity;

const examplePerson = wcif.persons[0] as Person;

describe('@constraints/createUniqueAssignment', () => {
  it('should pass when there are no other assignments', () => {
    const score = uniqueCompetitorAssignmentConstraint.score(
      wcif as Competition,
      activity_333r1g1,
      'competitor',
      examplePerson
    );

    expect(score).toEqual(0);
  });

  it('should not pass when there are no assignments', () => {
    const assignedPerson = {
      ...examplePerson,
      assignments: [
        {
          activityId: activity_333r1g2.id,
          assignmentCode: 'competitor',
        },
      ],
    } as Person;

    const score = uniqueCompetitorAssignmentConstraint.score(
      wcif as Competition,
      activity_333r1g1,
      'competitor',
      assignedPerson
    );

    expect(score).toEqual(null);
  });

  it('should pass when there are no other assignments with the same code', () => {
    const assignedPerson = {
      ...examplePerson,
      assignments: [
        {
          activityId: activity_333r1g2.id,
          assignmentCode: 'staff-scrambler',
        },
      ],
    } as Person;

    const score = uniqueCompetitorAssignmentConstraint.score(
      wcif as Competition,
      activity_333r1g1,
      'competitor',
      assignedPerson
    );

    expect(score).toEqual(0);
  });
});
