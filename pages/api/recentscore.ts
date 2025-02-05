import type { NextApiRequest, NextApiResponse } from 'next'
import { tools, v2, auth } from 'osu-api-extended'
import { Client } from 'osu-web.js'
import rosu from 'rosu-pp-js'
import fs from 'fs'
const {CLIENT_SECRET, CLIENT_IDV2} = process.env;

type ResponseData = {
  actualPP: number
  beatmap: string
}

export type Score = {
  actualPP: number
  beatmap: string
}

const clientSecret: any = CLIENT_SECRET;
const clientIDv2: any = CLIENT_IDV2;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {;
  const userID = Number(req.query.userID);
  const url = new URL(
		"https://osu.ppy.sh/oauth/token"
	);
	
	const headers = {
		"Accept": "application/json",
		"Content-Type": "application/x-www-form-urlencoded",
	};
	
	let body = "client_id="+clientIDv2+"&client_secret="+clientSecret+"&grant_type=client_credentials&scope=public";
	const response = await fetch(url, {
		method: "POST",
		headers,
		body: body,
	}).then(response => response.json());
	console.log("token made");
	let AccessToken = response.access_token;
  const api = new Client(AccessToken);
  
  await auth.login({
    type: 'v2',
    client_id: clientIDv2,
    client_secret: clientSecret,
    cachedTokenPath: './test.json', // path to the file your auth token will be saved (to prevent osu!api spam)
    scopes: ['public']
  });

  const recent = await api.users.getUserScores(userID, 'recent', {
    query: {
      mode: 'osu',
      offset: 0,
      limit: 1,
      include_fails: false
    }
  });
  const scorez = recent[0];
  const actualPP: number = Number((scorez.pp).toFixed(2));
  const score: Score = { 
    actualPP: actualPP,
    beatmap: scorez.beatmapset.title
  }

  res.status(200).json({ 
    actualPP: score.actualPP,
    beatmap: score.beatmap
  })
}
