import { IDroplet } from "dots-wrapper/dist/modules/droplet";
import { AxiosInstance } from 'axios';
import pWhilst from 'p-whilst';
import { sleep } from '@/helpers/sleep';

export class SpinUp {
  constructor(
    private client: AxiosInstance,
  ) {}

  get steps() {
    return {
      'Creating droplet': () => this.create(),
      'Waiting for droplet': () => this.wait(),
      'Assigning IP address': () => this.assign(),
      'Pinging MC server': () => this.ping()
    }
  }

  async create () {
    await this.client.post('/create')
  }

  async wait () {
    let state: string

    await pWhilst(
      () => state !== 'active',
      async () => {
        const { data } = await this.client.get<IDroplet>('/droplet')
        state = data.status
        await sleep(3000)
      }
    )
  }

  async assign () {
    await this.client.post('/assign')
  }

  async ping () {
    let state = false

    await pWhilst(
      () => !state,
      async () => {
        try {
          await this.client.get<string>('/ping')
          state = true
        } catch (_) {
          await sleep(5000)
        }
      }
    )
  }
}

