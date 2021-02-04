import { NextApiHandler } from "next";
import { withAuth } from "../../helpers/api-auth";
import { ping } from 'minecraft-server-ping'
import pWhilst from "p-whilst";

const handler: NextApiHandler = async (_, res) => {
    let state: 'down' | 'timeout' | string = 'down'
    let count = 0

    await pWhilst(
      () => state === 'down',
      async () => {
        if (count > 6) {
          return state = 'timeout'
        }
        console.log("pinging")
        count++
        try {
          const data = await ping("mc.boardinghousemassive.com")
          state = data.description.text
        } catch (_) {
          await new Promise(r => setTimeout(r, 5000))
        }
      }
    )

    if (state === 'timeout') {
      res.status(500).end()
    } else {
      res.status(200).end(state)
    }
}

export default withAuth(handler)
