'use client'

import React, { useState } from "react";
import Image from "next/image";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import './globals.css';
import { radioClasses } from "@mui/material";

export default function Home() {
  const [bID, setTitle] = useState('')
  const [uID, setBody] = useState('')
  const [scoreID, setScoreID] = useState('')
  const [beatmapsetID, setBeatmapSetID] = useState('')
  const [beatmaplink, setBeatmapLink] = useState('')
  const [misscount, setMisscount] = useState(0);
  const [miss, setMiss] = useState(0);
  const [maxmisscount, setMaxMisscount] = useState(0);
  const [hundred, setHundred] = useState(0);
  const [maxhundred, setMaxHundred] = useState(0);
  const [fifty, setFifty] = useState(0);
  const [maxFifty, setMaxFifty] = useState(0);
  const [beatmap, setBeatmap] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [mods, setMods] = useState("");
  const [accuracy, setAccuracy] = useState("");
  const [originalPP, setOriginalPP] = useState(0);
  const [actualPP, setActualPP] = useState("");
  const [maxPP, setMaxPP] = useState("");
  const [remainderPP, setRemainderPP] = useState(0);
  const [total, setTotal] = useState("");
  const [maxCombo, setMaxCombo] = useState(0);
  const [maximumCombo, setMaximumCombo] = useState(0);
  const [revealText, setRevealText] = useState(false);
  const [oK, setOk] = useState(0);
  const [great, setGreat] = useState(0);
  const [meh, setMeh] = useState(0);
  const [plus, setPlus] = useState("")
  const link = "https://osucalc-891757656779.us-east1.run.app";
  const linkdev = "http://localhost:3000";
  const submitData = async () => {
    let response = await fetch(link+"/api/get_recent_score?scoreID=");
    response = await response.json();
    console.log(response);
  }
  
  const submitScore = async () => {
    let response = await fetch(linkdev+"/api/get_score_with_id?scoreID=" + scoreID);

    response = await response.json();
    console.log(response);
    let responseArray: any[] = [];
    Object.values(response).map(x => { responseArray.push(x) });
    console.log(responseArray);
    let meh = responseArray[4].meh;
    let ok = responseArray[4].ok;
    let misscount = responseArray[4].miss;

    if(misscount == 0) misscount = 5
    if(meh == 0) meh = 5
    if(ok == 0) ok = 5
    setBeatmap(responseArray[0]);
    setMisscount(Number(responseArray[4].miss));
    setMaxMisscount(Math.floor(misscount * 10));
    setMaxHundred(Math.floor(ok * 5));
    setMaxFifty(Math.floor(meh * 5));
    setHundred(responseArray[4].ok)
    setFifty(responseArray[4].meh)
    setMiss(Number(responseArray[4].miss))
    setActualPP(responseArray[2]);
    setMods(responseArray[3] ?? "none");
    setAccuracy(responseArray[7]);
    setMaxPP(responseArray[1]);
    setMaxCombo(responseArray[6]);
    setTotal(responseArray[4].great + responseArray[4].meh + responseArray[4].ok + responseArray[4].miss);
    setOk(responseArray[4].ok);
    setGreat(responseArray[4].great);
    setMeh(responseArray[4].meh);
    setTitle(responseArray[8]);
    setMaximumCombo(responseArray[9]);
    setDifficulty(responseArray[11]);
    setBeatmapSetID("https://assets.ppy.sh/beatmaps/" + responseArray[10] + "/covers/cover.jpg");
    setBeatmapLink("https://osu.ppy.sh/beatmapsets/" + responseArray[10]);
    setRevealText(true);
    setOriginalPP(responseArray[2])
    setRemainderPP(0)
    setPlus("+/-")
  }

  const recalcData = async () => {
    let response = await fetch(linkdev+"/api/get_pp" +
      "?bID=" + bID +
      "&misscount=" + miss +
      "&accuracy=" + accuracy +
      "&mods=" + mods +
      "&great=" + great +
      "&ok=" + hundred +
      "&meh=" + fifty +
      "&total=" + total +
      "&maxcombo=" + maxCombo);
    response = await response.json();
    let responseArray: any[] = [];
    Object.values(response).map(x => { responseArray.push(x) })
    let remainder = Math.floor(responseArray[0] - originalPP);
    //this is fucking terrible
    if (remainder < 0) setPlus("-");
    if (remainder > 0) setPlus("+");
    if (remainder == 0) setPlus("+/-");
    remainder = Math.abs(remainder)
    setActualPP(responseArray[0]);
    setAccuracy(responseArray[2]);
    setMiss(Number(responseArray[1]));
    setRemainderPP(remainder)
    console.log(response);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 pb-10 gap-8 sm:p-10 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 row-start-2 items-center">
        <p>hey man this is a calculator for csr pp<br />thank you max for the pp calc js library</p>
        <input type="text"
          value={scoreID}
          size={15}
          onChange={(e) => setScoreID(e.target.value)}
          placeholder="enter score ID" />
        {!revealText ? <div className="flex flex-row gap-4">

          <button onClick={submitScore}>submit score</button> 
          </div>: null}

        {revealText ? <div className="flex flex-row gap-4">
          <button onClick={submitScore}>submit another score</button>
          <button onClick={recalcData}>recalc</button>
        </div> : null}

        {revealText ? <div className="flex flex-col items-center">
          <p>{beatmap}</p>
          <p>[{difficulty}] +{mods}</p>
          <p>accuracy: {accuracy}%, combo: {maxCombo}/{maximumCombo}x</p>
          <p className="preserve-white-space">stats: {oK} | {meh} | {misscount}  •  {originalPP}/{maxPP}pp</p>
          <p className="preserve-white-space">new stats: {hundred} | {fifty} | {miss}  •  {actualPP}pp  •  {plus}{remainderPP}pp</p>
          <Box sx={{ width: 300 }}>
            <Slider value={hundred} onChange={(e: any) => setHundred(e.target.value)} aria-label="secondary" valueLabelDisplay="auto" color="success" max={maxhundred} />
          </Box>
          <Box sx={{ width: 300 }}>
            <Slider value={fifty} onChange={(e: any) => setFifty(e.target.value)} aria-label="secondary" valueLabelDisplay="auto" color="primary" max={maxFifty} />
          </Box>
          <Box sx={{ width: 300 }}>
            <Slider value={miss} onChange={(e: any) => setMiss(e.target.value)} aria-label="secondary" valueLabelDisplay="auto" color="error" max={maxmisscount} />
          </Box>
          <p><a href={beatmaplink} title="to beatmapset page">
            <img src={beatmapsetID} alt={"to beatmap (no bg loaded)"}></img></a></p>
        </div> : null}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/koralreeef/osutest"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/github-mark-white.svg"
            alt="github"
            width={32}
            height={32}
          />
          source code
        </a>
      </footer>
    </div>
  );
}