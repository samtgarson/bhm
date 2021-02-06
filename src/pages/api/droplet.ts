import axios from "axios";
import { NextApiHandler } from "next";
import { withAuth } from "../../helpers/api-auth";
import { DoClient } from '../../services/do-client'

const handler: NextApiHandler = async (req, res) => {
  const client = new DoClient()
  const droplet = await client.getDroplet()

  if (req.method === 'GET') {
    if (droplet?.status === 'active') {
      try {
        await client.assignIp(droplet.id)
      } catch (err) {
      }
    }

    return res.json(droplet)
  }

  if (req.method === 'DELETE') {
    try {
      await client.destroyDroplet();
      return res.status(204).end();
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data)
      }
      res.status(500).json(err)
    }

  }
}

export default withAuth(handler)
