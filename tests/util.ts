import { Competition } from '@wca/helpers';
import { allChildActivitiesInRoom, rooms } from '../src/activities';

export const getActivityFromCode = (wcif: Competition, activityCode: string) =>
  rooms(wcif)
    .flatMap((room) => allChildActivitiesInRoom(room))
    .find((activity) => activity.activityCode === activityCode);
