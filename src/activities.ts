import {
  Activity,
  ActivityCode,
  Competition,
  Room,
  parseActivityCode,
} from '@wca/helpers';

export const rooms = (wcif: Competition) =>
  wcif.schedule.venues.flatMap((venue) => venue.rooms);

export const allChildActivitiesInRoom = (room: Room) =>
  room.activities.flatMap((activity) => allChildActivities(activity));

export const allChildActivities = (activity: Activity): Activity[] =>
  activity.childActivities?.flatMap((activity) => [
    activity,
    ...allChildActivities(activity),
  ]) || [];

export const isParentActivityCode = (
  parentActivityCode: ActivityCode,
  childActivityCode: ActivityCode
) => {
  const parent = parseActivityCode(parentActivityCode);
  const child = parseActivityCode(childActivityCode);

  if (parent.eventId !== child.eventId) {
    return false;
  }

  return (
    parent.eventId === child.eventId &&
    (!parent.roundNumber || parent.roundNumber === child.roundNumber) &&
    (!parent.attemptNumber || parent.attemptNumber === child.attemptNumber) &&
    (!parent.groupNumber || parent.groupNumber === child.groupNumber)
  );
};
