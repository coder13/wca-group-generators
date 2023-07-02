import { Competition } from '@wca/helpers';
import GroupGenerator from '../src/GroupGenerator';

import wcif from './mocks/BothellSummer2023.json';
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
});
