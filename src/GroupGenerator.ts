import { Activity, AssignmentCode, Competition, Person } from '@wca/helpers';
import { Constraint } from './constraints';
import {
  allChildActivitiesInRoom,
  isParentActivityCode,
  rooms,
} from './activities';

export default class GroupGenerator {
  wcif: Competition;
  constraints: Map<AssignmentCode, Constraint[]>;

  constructor(wcif: Competition) {
    this.wcif = wcif;
    this.constraints = new Map();
  }

  addConstraint(assignmentCode: AssignmentCode, constraint: Constraint) {
    if (!this.constraints.has(assignmentCode)) {
      this.constraints.set(assignmentCode, [constraint]);
    } else {
      this.constraints.set(assignmentCode, [
        ...(this.constraints.get(assignmentCode) as Constraint[]),
        constraint,
      ]);
    }
  }

  setConstraintsForAssignmentCode(
    assignmentCode: AssignmentCode,
    constraints: Constraint[]
  ) {
    this.constraints.set(assignmentCode, constraints);
  }

  /**
   * asserts that for all persons, they have a single competitor assignment and no conflicting assignments.
   * @param roundId
   */
  validate(roundId: string) {
    const round = this.wcif.events
      .flatMap((event) => event.rounds)
      .find((round) => round.id === roundId);

    if (!round) {
      throw new Error(`Round ${roundId} not found.`);
    }
  }

  generateForPerson(
    registrantId: number,
    assignmentCode: string,
    activities: Activity[]
  ) {
    const constraints = this.constraints.get(assignmentCode) || [];

    this.wcif.persons = this.wcif.persons.map((person) => {
      if (person.registrantId !== registrantId) {
        return person;
      }

      const activityScores = new Map<number, number>();
      activities.forEach((activity) => {
        activityScores.set(activity.id, 0);
        const scores = constraints.map((constraint) =>
          constraint.score(this.wcif, activity, assignmentCode, person)
        ) || [0];

        if (scores.some((score) => score === null)) {
          activityScores.delete(activity.id);
        } else {
          const score = (scores as number[]).reduce((a, b) => a + b, 0);
          activityScores.set(activity.id, score);
        }
      });

      if (activityScores.size === 0) {
        return person;
      }

      // find the activity with the highest score
      const bestActivityId = [...activityScores.entries()].reduce((a, b) =>
        a[1] > b[1] ? a : b
      )[0];

      return {
        ...person,
        assignments: [
          ...(person.assignments || []),
          {
            activityId: bestActivityId,
            stationNumber: null,
            assignmentCode,
          },
        ],
      };
    });
    return this;
  }

  /**
   * iterate over all accepted persons, for each assignmentCode, assign them to an activity
   * @param assignmentCodes
   * @param roundId
   */
  generate(assignmentCodes: string[], activities: Activity[]) {
    this.wcif.persons.forEach((person) => {
      if (person.registration?.status !== 'accepted') {
        return;
      }

      assignmentCodes.forEach((assignmentCode) => {
        console.log(assignmentCode);
        debugger;
        this.generateForPerson(person.registrantId, assignmentCode, activities);
      });
    });
    return this;

    /**
     * For each person
     * Consider all groups and score them based on constraints
     * Assign person to group with highest score
     *
     * What if it makes sense to give someone 2 assignments at a time?
     *
     * So for each person
     * for each assignment code
     *
     */
  }

  getWcif() {
    return this.wcif;
  }

  /**
   * Returns all child activities that are children of the given activity code.
   * @param activityCode
   * @returns
   */
  pickActivities(activityCode: string) {
    const childActivitiess = rooms(this.wcif).flatMap((room) =>
      allChildActivitiesInRoom(room)
    );

    return childActivitiess.filter((activity) =>
      isParentActivityCode(activityCode, activity.activityCode)
    );
  }
}
