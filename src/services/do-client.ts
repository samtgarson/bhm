import { createApiClient } from "dots-wrapper";
import { IDroplet } from "dots-wrapper/dist/modules/droplet";
import pWhilst from "p-whilst";

export enum Status {
  Up = "Up",
  Down = "Down"
}

const sleep = () => new Promise(r => setTimeout(r, 2000))

export class DoClient {
  private client: ReturnType<typeof createApiClient>;
  private prefix = process.env.DO_PREFIX!
  private sshKeys = [process.env.DO_SSH_KEY!]
  private size = process.env.DO_SIZE!
  private region = process.env.DO_REGION!
  private ip = process.env.DO_IP!

  constructor() {
    this.client = createApiClient({ token: process.env.DO_API_KEY! });
  }

  async getDroplet (): Promise<IDroplet | undefined> {
    const { data } = await this.client.droplet.listDroplets({ tag_name: this.prefix })

    return data.droplets[0]
  }

  async createDroplet() {
    const existing = await this.getDroplet();
    if (existing) return existing

    const snapshot = await this.findSnapshot()
    if (!snapshot) throw new Error('Could not find snapshot')

    const { data } = await this.client.droplet.createDroplet({
      image: snapshot.id,
      ssh_keys: this.sshKeys,
      name: this.prefix,
      size: this.size,
      region: this.region,
      monitoring: true,
      tags: [this.prefix]
    })

    return data.droplet
  }

  async assignIp(droplet: number) {
    const { data } = await this.client.floatingIp.assignIpToDroplet({ droplet_id: droplet, ip: this.ip })
    let { action } = data

    await pWhilst(
      () => action.status === 'in-progress',
      async () => { action = await this.getIPAction(action.id) }
    )

    if (action.status !== 'completed') throw new Error('Failed to assign UP')
  }

  async findSnapshot() {
    const { data } = await this.client.snapshot.listSnapshots({ resource_type: "droplet" })
    return data.snapshots.find(snap => snap.name === this.prefix)
  }

  async getAction(droplet: number, actionId: number) {
    const { data } = await this.client.droplet.getDropletAction({ action_id: actionId, droplet_id: droplet })
    return data.action
  }


  async destroyDroplet() {
    await this.client.droplet.deleteDropletsByTag({ tag_name: this.prefix })
  }

  async destroySnapshot(id: string) {
    await this.client.snapshot.deleteSnapshot({ snapshot_id: id });
  }

  async createSnapshot(droplet: number) {
    const { data } = await this.client.droplet.snapshotDroplet({ droplet_id: droplet, name: this.prefix });
    const { action } = data

    return action
  }

  private async getIPAction(actionId: number) {
    const { data } = await this.client.floatingIp.getFloatingIpAction({ action_id: actionId, ip: this.ip })
    await sleep()
    return data.action
  }
}
