import { AxiosInstance } from "axios";
import { SpinDown } from "./spin-down";
import { SpinUp } from "./spin-up";

export enum ProcessorStepState {
  Pending,
  InProgress,
  Done,
  Error
}

export type ProcessorState = Record<string, ProcessorStepState>

export class Processor {
  private _state: ProcessorState

  static spinUp(client: AxiosInstance, update: (state: ProcessorState) => void,) {
    const spinner = new SpinUp(client)

    return new Processor(update, spinner.steps)
  }

  static spinDown(client: AxiosInstance, update: (state: ProcessorState) => void,) {
    const spinner = new SpinDown(client)

    return new Processor(update, spinner.steps)
  }

  constructor(
    private update: (state: ProcessorState) => void,
    private steps: { [step: string]: () => Promise<void> }
  ) {
    this._state = Object.keys(steps).reduce((hsh, step) => ({ ...hsh, [step]: ProcessorStepState.Pending }), {})
  }

  async run() {
    for (const step in this.steps) {
      await this.runStep(step)
    }
  }

  private get state () { return this._state }
  private set state (state) {
    this._state = state
    this.update(state)
  }

  private  async runStep(step: string) {
    this.setState(step, ProcessorStepState.InProgress)
    try {
      await this.steps[step]()
      this.setState(step, ProcessorStepState.Done)
    } catch (err) {
      this.setState(step, ProcessorStepState.Error)
      throw err
    }
  }

  private setState(step: string, state: ProcessorStepState) {
    this.state = { ...this.state, [step]: state }
  }
}
