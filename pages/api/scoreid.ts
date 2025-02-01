import type { NextApiRequest, NextApiResponse } from 'next'
import { tools, v2, auth } from 'osu-api-extended'
import { Client } from 'osu-web.js'
import rosu from 'rosu-pp-js'
import fs from 'fs'

type ResponseData = {
  scoreID: number
}

export type Score = {
  actualPP: number,
  beatmap: string
}

const clientSecret = "Z77zfBSChTA1tJBxhWJErI8teMrXad6UqTOf1Wn0";
const clientIDv2 = 36823;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {;
  const scoreID = Number(req.query.scoreID);
  
  await auth.login({
    type: 'v2',
    client_id: clientIDv2,
    client_secret: clientSecret,
    cachedTokenPath: './test.json' // path to the file your auth token will be saved (to prevent osu!api spam)
  });

  const result = await v2.scores.details({
    id: scoreID,
  });

  const score: Score = { 
    actualPP: Number((result.pp).toFixed(2)),
    beatmap: result.beatmapset.title
  }
  console.log(result);
  res.status(200).json({ 
    actualPP: score.actualPP,
    beatmap: score.beatmap
  })
}