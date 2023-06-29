import { Activity, Competition, Person } from '@wca/helpers';
import {
  createUniqueAssignmentConstraint,
  mustBeInRoundConstraint,
} from '../../src/constraints';

import wcif from '../mocks/BothellSummer2023.json';
import { getActivityFromCode } from '../util';

const mustBeInRoundConstraintForCompetitor =
  mustBeInRoundConstraint('competitor');

const activity_333r1g1 = getActivityFromCode(
  wcif as Competition,
  '333-r1-g1'
) as Activity;

const activity_333r2g1: Activity = {
  id: 1,
  activityCode: '333-r2-g1',
  name: '3x3x3 Cube, Round 2, Group 1',
  childActivities: [],
  startTime: '2023-07-01T11:00:00.000Z',
  endTime: '2023-07-01T12:00:00.000Z',
  extensions: [],
};

const examplePersonSignedUpFor333: Person = {
  name: 'John Doe',
  countryIso2: 'US',
  wcaUserId: 2,
  registrantId: 1,
  registration: {
    wcaRegistrationId: 2,
    eventIds: ['333'],
    status: 'accepted',
  },
};

const examplePersonNotSignedUpFor333: Person = {
  name: 'John Doe',
  countryIso2: 'US',
  wcaUserId: 2,
  registrantId: 1,
  registration: {
    wcaRegistrationId: 2,
    eventIds: ['444'],
    status: 'accepted',
  },
};

describe('@constraints/mustBeInRound', () => {
  it("should pass when assignment codes don't match", () => {
    const score = mustBeInRoundConstraintForCompetitor.score(
      wcif as Competition,
      activity_333r1g1,
      'staff-judge',
      examplePersonSignedUpFor333
    );

    expect(score).toEqual(0);
  });

  it('should not pass when person is not registered', () => {
    const score = mustBeInRoundConstraintForCompetitor.score(
      wcif as Competition,
      activity_333r1g1,
      'competitor',
      examplePersonNotSignedUpFor333
    );

    expect(score).toEqual(null);
  });

  it('should pass when the person is registered', () => {
    const score = mustBeInRoundConstraintForCompetitor.score(
      wcif as Competition,
      activity_333r1g1,
      'competitor',
      examplePersonSignedUpFor333
    );

    expect(score).toEqual(0);
  });

  it('should not pass when user did not advance to next round', () => {
    const wcifWith333r2Open = {
      ...wcif,
      events: wcif.events.map((event) =>
        event.id === '333'
          ? {
              ...event,
              rounds: event.rounds.map((round) =>
                round.id === '333-r2'
                  ? {
                      ...round,
                      results: [
                        {
                          personId: 2,
                        },
                      ],
                    }
                  : round
              ),
            }
          : event
      ),
    } as Competition;

    const score = mustBeInRoundConstraintForCompetitor.score(
      wcifWith333r2Open,
      activity_333r2g1,
      'competitor',
      examplePersonSignedUpFor333
    );

    expect(score).toEqual(null);
  });

  it('should pass when user did advance to next round', () => {
    const wcifWith333r2Open = {
      ...wcif,
      events: wcif.events.map((event) =>
        event.id === '333'
          ? {
              ...event,
              rounds: event.rounds.map((round) =>
                round.id === '333-r2'
                  ? {
                      ...round,
                      results: [
                        {
                          personId: 1,
                        },
                      ],
                    }
                  : round
              ),
            }
          : event
      ),
    } as Competition;

    const score = mustBeInRoundConstraintForCompetitor.score(
      wcifWith333r2Open,
      activity_333r2g1,
      'competitor',
      examplePersonSignedUpFor333
    );

    expect(score).toEqual(0);
  });
});
