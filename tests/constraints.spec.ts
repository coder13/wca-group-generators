import { Activity, Competition, Person } from '@wca/helpers';
import { createUniqueAssignmentConstraint } from '../src/constraints';

import wcif from './mocks/BothellSummer2023.json';
import { allChildActivitiesInRoom, rooms } from '../src/activities';

const uniqueCompetitorAssignmentConstraint =
  createUniqueAssignmentConstraint('competitor');

describe('Constraints', () => {
  const activity_333r1g1 = rooms(wcif as Competition)
    .flatMap((room) => allChildActivitiesInRoom(room))
    .find((activity) => activity.activityCode === '333-r1-g1') as Activity;
  const activity_333r1g2 = rooms(wcif as Competition)
    .flatMap((room) => allChildActivitiesInRoom(room))
    .find((activity) => activity.activityCode === '333-r1-g2') as Activity;

  const examplePerson = wcif.persons[0] as Person;

  it('Unique constraint should pass when there are no assignments', () => {
    const score = uniqueCompetitorAssignmentConstraint.score(
      wcif as Competition,
      activity_333r1g1,
      'competitor',
      examplePerson
    );

    expect(score).toEqual(0);
  });

  it('Unique constraint should not pass when there are no assignments', () => {
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
});
