import { NextApiHandler } from "next";
import { withAuth } from "@/helpers/api-auth";
import { DoClient } from '@/services/do-client'

const handler: NextApiHandler = async (_, res) => {
  const client = new DoClient()

  const droplet = await client.createDroplet()

  res.status(200).json(droplet)
}

export default withAuth(handler)
