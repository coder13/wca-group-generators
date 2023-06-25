import { activityCodeToName, Activity } from '@wca/helpers';
import { createGroupActivity } from '../src/utils';

describe('Groups', () => {
  const roundActivity: Activity = {
    id: 1,
    name: '3x3x3 Round 1',
    activityCode: '333-r1',
    startTime: '2020-01-01T10:00:00.000Z',
    endTime: '2020-01-01T11:00:00.000Z',
    childActivities: [],
    extensions: [],
  };

  it('should create group given group number', () => {
    const activity = createGroupActivity(2, roundActivity, 2, null, null);

    expect(activity).toEqual({
      id: 2,
      name: activityCodeToName('333-r1-g2'),
      activityCode: '333-r1-g2',
      startTime: '2020-01-01T10:00:00.000Z',
      endTime: '2020-01-01T11:00:00.000Z',
      childActivities: [],
      extensions: [],
    });
  });
});
