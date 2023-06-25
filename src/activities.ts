import { Activity, Competition, Room } from '@wca/helpers';

export const rooms = (wcif: Competition) =>
  wcif.schedule.venues.flatMap((venue) => venue.rooms);

export const allChildActivitiesInRoom = (room: Room) =>
  room.activities.flatMap((activity) => allChildActivities(activity));

export const allChildActivities = (activity: Activity): Activity[] =>
  activity.childActivities?.flatMap((activity) => [
    activity,
    ...allChildActivities(activity),
  ]) || [];
