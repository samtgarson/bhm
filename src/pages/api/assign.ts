import axios from "axios";
import { NextApiHandler } from "next";
import { withAuth } from "../../helpers/api-auth";
import { DoClient } from '../../services/do-client'

const handler: NextApiHandler = async (_, res) => {
  const client = new DoClient()
  try {
    const droplet = await client.getDroplet()
    await client.assignIp(droplet.id)

    res.status(200).end()
  } catch (err) {
    console.error(err);
    if (axios.isAxiosError(err)) {
      console.log(err.response?.data)
    }
    res.status(500).json(err)
  }
}

export default withAuth(handler)
