import { AxiosInstance } from "axios";

export enum ProcessorStepState {
  Pending,
  InProgress,
  Done,
  Error
}

export type ProcessorState = Record<string, ProcessorStepState>

export abstract class Processor {
  private _state: ProcessorState

  constructor(
    protected client: AxiosInstance,
    private update: (state: ProcessorState) => void,
    private steps: { [step: string]: (client: AxiosInstance) => Promise<void> }
  ) {
    this._state = Object.keys(steps).reduce((hsh, step) => ({ ...hsh, [step]: ProcessorStepState.Pending }), {})
  }

  async run() {
    let result: void
    for (const step in this.steps) {
      result = await this.runStep(step)
    }

    return result
  }

  private get state () { return this._state }
  private set state (state) {
    this._state = state
    this.update(state)
  }

  private  async runStep(step: string) {
    this.setState(step, ProcessorStepState.InProgress)
    try {
      await this.steps[step](this.client)
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
