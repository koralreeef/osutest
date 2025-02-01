import type { NextApiRequest, NextApiResponse } from 'next'
import { tools } from 'osu-api-extended'
import rosu from 'rosu-pp-js'
import fs from 'fs'

type ResponseData = {
  bID: number
  misscount: number
  accuracy: number
  mods?: string
  great: number
  ok: number
  meh: number
  total: number
  maxcombo: number
}

type Stats = {
  actualPP: number
  misscount: number
  accuracy: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {;
	
  const bytes = fs.readFileSync("./maps/"+req.query.bID+".osu");
  const map = new rosu.Beatmap(bytes);
  const ok = Number(req.query.ok); 
  let great = Number(req.query.great); 
  const meh = Number(req.query.meh); 
  const misscount = Number(req.query.misscount); 
  const maxcombo = Number(req.query.maxcombo);
  const hits = {
    ok: ok ?? 0,
    great: great ?? 0,
    meh: meh?? 0,
    miss: misscount ?? 0,
  }
  
  let modString = (req.query.mods).replace(",", "");
  let scrub = true;
  while(scrub){
    modString = modString.replace(",", "");
    console.log(modString)
    if(!modString.includes(",")){
      scrub = false;
    }
  }
  console.log(modString)
  let total = Number(req.query.total);
  const newTotal = hits.ok + hits.great + hits.meh + hits.miss;
  const subtract = Math.abs(newTotal - total);
  if(newTotal > total){
    hits.great = hits.great - subtract;
  } else if(newTotal < total) {
    hits.great = hits.great + subtract;
  }
  const sc = tools.calculate_accuracy(hits, total, 'osu', false);
  const maxAttrs = new rosu.Performance({ mods: modString, lazer: false }).calculate(map);
  const currAttrs = new rosu.Performance({
    mods: modString ?? 'CL', // Must be the same as before in order to use the previous attributes!
    misses: misscount,
    lazer: false,
    accuracy: sc.accuracy,
    combo: maxcombo,
}).calculate(maxAttrs); 
  map.free();
  
  const score: Stats = { 
      actualPP: Number((currAttrs.pp).toFixed(2)),
      misscount: misscount,
      accuracy: Number(sc.accuracy.toFixed(2))
    }
  res.status(200).json({ 
    actualPP: score.actualPP,
    misscount: score.misscount,
    accuracy: score.accuracy
  })
}