import { NextApiHandler } from "next";
import { withAuth } from "../../../helpers/api-auth";
import { DoClient } from '../../../services/do-client'

const handler: NextApiHandler = async (req, res) => {
  const client = new DoClient()
  const { id } = req.query as { id: string }

  if (req.method === 'GET') {
    const droplet = await client.getDroplet()

    if (!droplet) return res.status(404).end()

    const action = await client.getAction(droplet.id, parseInt(id, 10))

    return res.json(action)
  }

  if (req.method === 'DELETE') {
    await client.destroySnapshot(id);
    return res.status(204).end();
  }
}

export default withAuth(handler)
