import axios from "axios";
import { NextApiHandler } from "next";
import { withAuth } from "../../../helpers/api-auth";
import { DoClient } from '../../../services/do-client'

const handler: NextApiHandler = async (req, res) => {
  const client = new DoClient()

  if (req.method === 'GET') {
    const snapshot = await client.findSnapshot()
      if (!snapshot) return res.status(404).end();

      return res.json(snapshot)
  }

  if (req.method === 'POST') {
    try {
      const droplet = await client.getDroplet()
      if (!droplet) return res.status(404).end();

      const action = await client.createSnapshot(droplet.id)

      res.status(200).json(action)
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
