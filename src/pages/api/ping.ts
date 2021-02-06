import { NextApiHandler } from "next";
import { withAuth } from "../../helpers/api-auth";
import { ping } from 'minecraft-server-ping'

const handler: NextApiHandler = async (_, res) => {
    await ping("mc.boardinghousemassive.com")

    res.status(200).end()
}

export default withAuth(handler)
