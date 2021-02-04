import { NextApiHandler } from "next";
import { withAuth } from "../../helpers/api-auth";
import { DoClient } from '../../services/do-client'

const handler: NextApiHandler = async (_, res) => {
  const client = new DoClient()
  const droplet = await client.getDroplet()

  if (droplet?.status === 'active') {
    try {
      await client.assignIp(droplet.id)
    } catch (err) {
    }
  }

  res.send(droplet)
}

export default withAuth(handler)
