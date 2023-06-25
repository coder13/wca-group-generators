import { Competition } from '@wca/helpers';
import { Constraint } from './constraints';

export default class GroupGenerator {
  wcif: Competition;
  constraints: Constraint[];

  constructor(wcif: Competition) {
    this.wcif = wcif;
    this.constraints = [];
  }

  addConstraint(constraint: Constraint) {
    this.constraints.push(constraint);
  }

  setConstraints(constraints: Constraint[]) {
    this.constraints = constraints;
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

  /**
   * For each assignmentCode, iterate over all persons and give them an assignment for the assignmentCode.
   * @param assignmentCodes
   * @param roundId
   */
  generate(assignmentCodes: string[], roundId: string) {
    const round = this.wcif.events
      .flatMap((event) => event.rounds)
      .find((round) => round.id === roundId);

    if (!round) {
      throw new Error(`Round ${roundId} not found.`);
    }

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
}
