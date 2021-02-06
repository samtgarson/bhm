import { NextApiHandler } from "next";
import { withAuth } from "../../helpers/api-auth";
import { DoClient } from '../../services/do-client'

const handler: NextApiHandler = async (_, res) => {
  const client = new DoClient()
    const droplet = await client.getDroplet()
    if (!droplet) return res.status(404).end();

  try {
    await client.assignIp(droplet.id)

  } catch (err) {
    console.error(err);
  }
  res.status(200).end()
}

export default withAuth(handler)
