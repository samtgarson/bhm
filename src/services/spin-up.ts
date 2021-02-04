import { Processor, ProcessorState } from './processor'
import { IDroplet } from "dots-wrapper/dist/modules/droplet";
import { AxiosInstance } from 'axios';
import pWhilst from 'p-whilst';

export class SpinUp extends Processor {
  constructor(
    client: AxiosInstance,
    update: (state: ProcessorState) => void
  ) {
    super(client, update, {
      'Creating droplet': SpinUp.create,
      'Waiting for droplet': SpinUp.wait,
      'Assigning IP address': SpinUp.assign,
      'Pinging MC server': SpinUp.ping
    })
  }

  static async create (client: AxiosInstance) {
    await client.post('/create')
  }

  static async wait (client: AxiosInstance) {
    let state: string

    await pWhilst(
      () => state !== 'active',
      async () => {
        const { data } = await client.get<IDroplet>('/droplet')
        state = data.status
        await new Promise(r => setTimeout(r, 3000))
      }
    )
  }

  static async assign (client: AxiosInstance) {
    await client.post('/assign')
  }

  static async ping (client: AxiosInstance) {
    await client.get<string>('/ping')
  }
}

