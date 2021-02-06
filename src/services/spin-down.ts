import { sleep } from '@/helpers/sleep';
import { AxiosInstance } from 'axios';
import { IAction } from 'dots-wrapper/dist/modules/action';
import { ISnapshot } from 'dots-wrapper/dist/modules/snapshot';
import pWhilst from 'p-whilst';

export class SpinDown {
  constructor(
    private client: AxiosInstance
  ) {}

  private oldSnapshot: string | undefined;

  get steps() {
    return {
      'Creating new snapshot': () => this.snapshot(),
      'Destroying old snapshot': () => this.destroyOldSnapshot(),
      'Destroying droplet': () => this.destroyDroplet()
    }
  }

  async snapshot() {
    this.oldSnapshot = await this.getExistingSnapshot()

    await this.createSnapshot()
  }

  async destroyOldSnapshot() {
    if (!this.oldSnapshot) throw new Error("Missing ID for old snapshot")
    await this.client.delete(`/snapshot/${this.oldSnapshot}`)
  }

  async destroyDroplet() {
    await this.client.delete('/droplet')
  }

  private async createSnapshot() {
    let { data: action } = await this.client.post<IAction>('/snapshot')

    await pWhilst(
      () => action.status === 'in-progress',
      async () => {
        action = await this.getAction(action.id) ?? action
        await sleep(8000)
      }
    )

    if (action.status !== 'completed') throw new Error('Failed to create snapshot')
  }

  private async getExistingSnapshot() {
    const { data: { id } } = await this.client.get<ISnapshot>('/snapshot')
    return id
  }

  private async getAction(actionId: number) {
    try {
    const { data } = await this.client.get(`/snapshot/${actionId}`)
    return data
    } catch(err) {
      // noop
    }
  }
}

