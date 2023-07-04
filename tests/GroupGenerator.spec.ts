import { Competition } from '@wca/helpers';
import GroupGenerator from '../src/GroupGenerator';

import wcif from './mocks/BothellSummer2023.json';
import { allChildActivitiesInRoom, rooms } from '../src/activities';
import { balancedGroupSize, mustBeInRoundConstraint } from '../src/constraints';
const freshWcif = () => ({ ...wcif } as Competition);

describe('GroupGenerator', () => {
  describe('generateForPerson', () => {
    it('Handles no activities', () => {
      const EmptyGroupGenerator = new GroupGenerator(
        freshWcif() as Competition
      );
      const newWcif = EmptyGroupGenerator.generateForPerson(
        1,
        'competitor',
        []
      ).getWcif();

      const registrant1 = newWcif.persons.find(
        (person) => person.registrantId === 1
      );

      expect(registrant1?.assignments).toHaveLength(0);
    });

    it('Handles one activity', () => {
      const EmptyGroupGenerator = new GroupGenerator(
        freshWcif() as Competition
      );
      const newWcif = EmptyGroupGenerator.generateForPerson(1, 'competitor', [
        {
          id: 1,
          name: '3x3x3 Round 1 Group 1',
          activityCode: '333-r1',
          childActivities: [],
          startTime: '2023-07-01T09:00:00.000Z',
          endTime: '2023-07-01T10:00:00.000Z',
          extensions: [],
        },
      ]).getWcif();

      const registrant1 = newWcif.persons.find(
        (person) => person.registrantId === 1
      );

      expect(registrant1?.assignments).toHaveLength(1);
      expect(registrant1?.assignments?.[0].activityId).toBe(1);
    });

    it('Handles two activities', () => {
      const EmptyGroupGenerator = new GroupGenerator(
        freshWcif() as Competition
      );
      const newWcif = EmptyGroupGenerator.generateForPerson(1, 'competitor', [
        {
          id: 1,
          name: '3x3x3 Round 1 Group 1',
          activityCode: '333-r1',
          childActivities: [],
          startTime: '2023-07-01T09:00:00.000Z',
          endTime: '2023-07-01T10:00:00.000Z',
          extensions: [],
        },
        {
          id: 1,
          name: '3x3x3 Round 1 Group 2',
          activityCode: '333-r2',
          childActivities: [],
          startTime: '2023-07-01T09:00:00.000Z',
          endTime: '2023-07-01T10:00:00.000Z',
          extensions: [],
        },
      ]).getWcif();

      const registrant1 = newWcif.persons.find(
        (person) => person.registrantId === 1
      );

      expect(registrant1?.assignments).toHaveLength(1);
      expect(registrant1?.assignments?.[0].activityId).toBe(1);
    });
  });

  describe('pickActivities', () => {
    it('Handles no activities', () => {
      const EmptyGroupGenerator = new GroupGenerator(
        freshWcif() as Competition
      );
      const activities = EmptyGroupGenerator.pickActivities('222-r1');
      expect(activities).toHaveLength(0);
    });

    it('Gets some activites from round code', () => {
      const EmptyGroupGenerator = new GroupGenerator(
        freshWcif() as Competition
      );
      const activities = EmptyGroupGenerator.pickActivities('333-r1');
      expect(activities).toHaveLength(6);
    });
  });

  describe('generate', () => {
    it('Assigns all people to activities given no constraints', () => {
      const EmptyGroupGenerator = new GroupGenerator({
        ...freshWcif(),
      } as Competition);

      const newWcif = EmptyGroupGenerator.generate(
        ['competitor'],
        EmptyGroupGenerator.pickActivities('333-r1-g1')
      ).getWcif();

      const allChildActivities = rooms(newWcif).flatMap((room) =>
        allChildActivitiesInRoom(room)
      );

      const activities = allChildActivities.filter(
        (activity) => activity.activityCode === '333-r1-g1'
      );

      const numberOfPeople = newWcif.persons.length;

      const allAssignedTo333r1g1 = newWcif.persons.filter((person) =>
        person.assignments?.some(
          (assignment) =>
            assignment.assignmentCode === 'competitor' &&
            activities.some((activity) => activity.id === assignment.activityId)
        )
      ).length;

      expect(allAssignedTo333r1g1).toBe(numberOfPeople);

      expect(
        newWcif.persons.filter((person) =>
          person.assignments?.some(
            (assignment) =>
              assignment.assignmentCode === 'competitor' &&
              assignment.activityId === activities[0].id
          )
        ).length
      ).toBe(0);

      expect(
        newWcif.persons.filter((person) =>
          person.assignments?.some(
            (assignment) =>
              assignment.assignmentCode === 'competitor' &&
              assignment.activityId === activities[1].id
          )
        ).length
      ).toBe(numberOfPeople);
    });

    it('Assigns all people to activities given basic same group size constraints', () => {
      const EmptyGroupGenerator = new GroupGenerator({
        ...freshWcif(),
      } as Competition);

      EmptyGroupGenerator.addConstraint(balancedGroupSize('competitor'));

      const newWcif = EmptyGroupGenerator.generate(
        ['competitor'],
        EmptyGroupGenerator.pickActivities('333-r1-g1')
      ).getWcif();

      const activities = rooms(newWcif)
        .flatMap((room) => allChildActivitiesInRoom(room))
        .filter((activity) => activity.activityCode === '333-r1-g1');

      const numberOfPeople = newWcif.persons.filter(
        (person) => person.registration?.status === 'accepted'
      ).length;
      const half = Math.floor(numberOfPeople / 2);
      const otherHalf = numberOfPeople - half;

      expect(
        newWcif.persons.filter((person) =>
          person.assignments?.some(
            (assignment) =>
              assignment.assignmentCode === 'competitor' &&
              assignment.activityId === activities[0].id
          )
        ).length
      ).toBe(half);

      expect(
        newWcif.persons.filter((person) =>
          person.assignments?.some(
            (assignment) =>
              assignment.assignmentCode === 'competitor' &&
              assignment.activityId === activities[1].id
          )
        ).length
      ).toBe(otherHalf);
    });

    it('Assigns all people to activities given basic registered and same group size constraints', () => {
      const EmptyGroupGenerator = new GroupGenerator({
        ...freshWcif(),
      } as Competition);

      EmptyGroupGenerator.addConstraint(mustBeInRoundConstraint('competitor'));
      EmptyGroupGenerator.addConstraint(balancedGroupSize('competitor'));

      const newWcif = EmptyGroupGenerator.generate(
        ['competitor'],
        EmptyGroupGenerator.pickActivities('333-r1-g1')
      ).getWcif();

      const activities = rooms(newWcif)
        .flatMap((room) => allChildActivitiesInRoom(room))
        .filter((activity) => activity.activityCode === '333-r1-g1');

      const numberOfPeople = newWcif.persons.filter(
        (person) =>
          person.registration?.status === 'accepted' &&
          person.registration.eventIds.includes('333')
      ).length;
      const half = Math.floor(numberOfPeople / 2);
      const otherHalf = numberOfPeople - half;

      expect(
        newWcif.persons.filter((person) =>
          person.assignments?.some(
            (assignment) =>
              assignment.assignmentCode === 'competitor' &&
              assignment.activityId === activities[0].id
          )
        ).length
      ).toBe(half);

      expect(
        newWcif.persons.filter((person) =>
          person.assignments?.some(
            (assignment) =>
              assignment.assignmentCode === 'competitor' &&
              assignment.activityId === activities[1].id
          )
        ).length
      ).toBe(otherHalf);
    });
  });
});
