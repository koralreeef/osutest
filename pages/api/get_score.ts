import type { NextApiRequest, NextApiResponse } from 'next'
import { tools } from 'osu-api-extended'
import { Client } from 'osu-web.js'
import rosu from 'rosu-pp-js'
import fs from 'fs'

type ResponseData = {
  beatmap: string
  maxPP: number
  actualPP: number
  mods: string[]
  hits: {
    ok: number
    great: number,
    meh: number,
    miss: number,
  }
  totalHits: number,
  accuracy: number,
  maxcombo: number
}

export type Score = {
  beatmap: string
  maxPP: number
  actualPP: number
  mods: any[]
  hits: {
    ok: number
    great: number,
    meh: number,
    miss: number,
  }
  totalHits: number,
  accuracy: number,
  maxcombo: number
}

const clientSecret = "Z77zfBSChTA1tJBxhWJErI8teMrXad6UqTOf1Wn0";
const clientIDv2 = 36823;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {;
  const beatmapID = Number(req.query.bID);
  const userID = Number(req.query.uID);
  let score;
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
  const api = new Client(AccessToken);
  score = await api.beatmaps.getBeatmapUserScore(beatmapID, userID, {
    query: {
      mode: 'osu'
    }
  });
  //console.log(score)
  const result2 = await tools.download_beatmaps({
    type: 'difficulty',
    host: 'osu',
    id: score.score.beatmap.id,
    file_path: "./maps/"+score.score.beatmap.id+".osu"
  });

  const bytes = fs.readFileSync("./maps/"+score.score.beatmap.id+".osu");
  const map = new rosu.Beatmap(bytes);
  const maxAttrs = new rosu.Performance({ mods: score.score.mods, lazer: false }).calculate(map);

  const hits = {
    ok: score.score.statistics.count_100 ?? 0,
    great: score.score.statistics.count_300 ?? 0,
    meh: score.score.statistics.count_50 ?? 0,
    miss: score.score.statistics.count_miss ?? 0,
  }
  const total: any = score.score.statistics.count_100 
  + score.score.statistics.count_300
  + score.score.statistics.count_50 
  + score.score.statistics.count_miss;

  const beatmap = await api.beatmaps.getBeatmap(beatmapID);
  const sc = tools.calculate_accuracy(hits, total, 'osu', false);
  const currAttrs = new rosu.Performance({
    mods: score.score.mods ?? 'CL', // Must be the same as before in order to use the previous attributes!
    misses: score.score.statistics.count_miss,
    lazer: false,
    accuracy: sc.accuracy,
    combo: score.score.max_combo,
}).calculate(maxAttrs); 
  //console.log(maxAttrs);
  map.free();
  console.log(score.score.mods)
  const beatmapData = beatmap.beatmapset.artist + " - " +beatmap.beatmapset.title + " [" +beatmap.version + "]"  
  const scoredump: Score = { 
      beatmap: beatmapData,
      maxPP: Number((maxAttrs.pp).toFixed(2)),
      actualPP: Number((currAttrs.pp).toFixed(2)),
      mods: score.score.mods ?? ["CL"],
      hits: hits,
      totalHits: total,
      accuracy: sc.accuracy,
      maxcombo: score.score.max_combo
    }
  res.status(200).json({ 
    beatmap: scoredump.beatmap,
    maxPP: scoredump.maxPP,
    actualPP: scoredump.actualPP,
    mods: scoredump.mods,
    hits: scoredump.hits,
    totalHits: scoredump.totalHits,
    maxcombo: scoredump.maxcombo,
    accuracy: Number(sc.accuracy.toFixed(2))
  })
}