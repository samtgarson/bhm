import { NextApiHandler } from "next";
import { withAuth } from "~/helpers/api-auth";

const handler: NextApiHandler = async (req, res) => {
  res.json({ result: 'ok' })
}

export default withAuth(handler)
