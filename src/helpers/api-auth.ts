import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import { JsonWebTokenError } from 'jsonwebtoken'
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { Request, Response} from 'express'

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://samtgarson.eu.auth0.com/.well-known/jwks.json`
  }),

  audience: 'https://boardinghousemassive.com/api',
  issuer: `https://samtgarson.eu.auth0.com/`,
  algorithms: ['RS256']
});

export const withAuth = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await new Promise<void>((resolve, reject) => checkJwt(
      req as unknown as Request,
      res as unknown as Response,
      (err: any) => err ? reject(err) : resolve()
    ));
    return handler(req, res);
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      res.status(401).end
    }
  }
}
