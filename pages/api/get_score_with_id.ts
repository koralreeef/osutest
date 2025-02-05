import type { NextApiRequest, NextApiResponse } from 'next'
import { auth, tools, v2 } from 'osu-api-extended'
import { Client } from 'osu-web.js'
import rosu from 'rosu-pp-js'
import fs from 'fs'
const {CLIENT_SECRET, CLIENT_IDV2} = process.env;

type ResponseData = {
  beatmap: string
  maxPP: number
  actualPP: number
  mods: string
  hits: {
    ok: number
    great: number,
    meh: number,
    miss: number,
  }
  totalHits: number
  accuracy: number
  maxcombo: number
  beatmapID: number
  maximumcombo: number
  beatmapsetID: number
  difficulty: string
}

export type Score = {
  beatmap: string
  maxPP: number
  actualPP: number
  mods: string
  hits: {
    ok: number
    great: number
    meh: number
    miss: number
  }
  totalHits: number
  accuracy: number
  maxcombo: number
  beatmapID: number
  maximumcombo: number
  beatmapsetID: number
  difficulty: string
}

const clientSecret: any = CLIENT_SECRET;
const clientIDv2: any = CLIENT_IDV2;

console.log(clientSecret);
console.log(clientIDv2);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {;
  const scoreID = Number(req.query.scoreID);
  let score;
  let modString = "";
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
  // Fetch data from external API
  await auth.login({
    type: 'v2',
    client_id: clientIDv2,
    client_secret: clientSecret,
    cachedTokenPath: './test.json', // path to the file your auth token will be saved (to prevent osu!api spam)
    scopes: ['public']
  });
  score = await v2.scores.details({
    id: scoreID,
  });
  const beatmapID = score.beatmap_id;
  for(const mod of score.mods){
    modString = modString + mod.acronym;
  }
  if (!fs.existsSync("./public/maps")) fs.mkdirSync("./public/maps"); //make downloads directory if none
  //console.log(score)
  const api = new Client(AccessToken);
  const result2 = await tools.download_beatmaps({
    type: 'difficulty',
    host: 'osu',
    id: beatmapID, 
    file_path: "./public/maps/"+beatmapID+".osu"
  });
  console.log(result2);

  const bytes = fs.readFileSync("./public/maps/"+beatmapID+".osu");
  const map = new rosu.Beatmap(bytes);
  const maxAttrs = new rosu.Performance({ mods: modString ?? 'CL', lazer: false }).calculate(map);
  const ok = score.statistics.ok ?? 0;
  const great = score.statistics.great ?? 0;
  const meh = score.statistics.meh ?? 0;
  const miss = score.statistics.miss ?? 0;
  const hits = {
    ok: ok,
    great: great,
    meh: meh,
    miss: miss
  }
  
  const total: any = ok + great + meh + miss;
  const beatmap = await api.beatmaps.getBeatmap(beatmapID);
  const sc = tools.calculate_accuracy(hits, total, 'osu', false);
  const currAttrs = new rosu.Performance({
    mods: modString ?? 'CL', // Must be the same as before in order to use the previous attributes!
    misses: hits.miss,
    lazer: false,
    accuracy: sc.accuracy,
    combo: score.max_combo,
}).calculate(maxAttrs); 
  //console.log(maxAttrs);
  map.free();
  console.log(score.mods)
  const beatmapData = beatmap.beatmapset.artist + " - " +beatmap.beatmapset.title
  const beatmapDifficulty = beatmap.version 
  const scoredump: Score = { 
      beatmap: beatmapData,
      maxPP: Number((maxAttrs.pp).toFixed(2)),
      actualPP: Number((currAttrs.pp).toFixed(2)),
      mods: modString ?? ["CL"],
      hits: hits,
      totalHits: total,
      accuracy: sc.accuracy,
      maxcombo: score.max_combo,
      beatmapID: beatmapID,
      maximumcombo: score.beatmap.max_combo,
      beatmapsetID: score.beatmapset.id,
      difficulty: beatmapDifficulty,
    }
  res.status(200).json({ 
    beatmap: scoredump.beatmap,
    maxPP: scoredump.maxPP,
    actualPP: scoredump.actualPP,
    mods: scoredump.mods,
    hits: scoredump.hits,
    totalHits: scoredump.totalHits,
    maxcombo: scoredump.maxcombo,
    accuracy: Number(sc.accuracy.toFixed(2)),
    beatmapID: beatmapID,
    maximumcombo: score.beatmap.max_combo,
    beatmapsetID: score.beatmapset.id,
    difficulty: beatmapDifficulty,
  })
}