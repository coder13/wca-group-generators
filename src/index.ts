import { activityCodeToName, parseActivityCode, Activity } from '@wca/helpers';

export const createGroupActivity = (
  id: number,
  roundActivity: Activity,
  groupNumber: number,
  startTime: string | null,
  endTime: string | null
): Activity => {
  const { eventId, roundNumber, attemptNumber } = parseActivityCode(
    roundActivity.activityCode
  );

  const activityCode =
    `${eventId}-r${roundNumber}-g${groupNumber}` +
    (attemptNumber ? `-a${attemptNumber}` : '');

  console.log(activityCode);

  return {
    id,
    name: activityCodeToName(activityCode),
    activityCode,
    startTime: startTime || roundActivity.startTime,
    endTime: endTime || roundActivity.endTime,
    childActivities: [],
    extensions: [],
  };
};
