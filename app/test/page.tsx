'use client'

import React, { useState } from "react";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import './input.css';

export default function Home() {
    const [bID, setTitle] = useState('')
    const [uID, setBody] = useState('')
    const [scoreData, setScoreData] = useState('');
    const [value2, setValue2] = useState(50);
    const [misscount, setMisscount] = useState(0);
    const [maxmisscount, setMaxMisscount] = useState(0);
    const [beatmap, setBeatmap] = useState("");
    const [mods, setMods] = useState("");
    const [accuracy, setAccuracy] = useState("");
    const [actualPP, setActualPP] = useState("");
    const [maxPP, setMaxPP] = useState("");
    const [total, setTotal] = useState("");
    const [maxCombo, setMaxCombo] = useState(0);
    const [revealText, setRevealText] = useState(false);
    const [oK, setOk] = useState(0);
    const [great, setGreat] = useState(0);
    const [meh, setMeh] = useState(0);

    const submitData = async () => {
        let response= await fetch("http://localhost:3000/api/get_score?bID="+bID+"&uID="+uID);
        //let response = await fetch("http://localhost:3000/api/get_score?bID=2496318&uID=754792");
        response = await response.json()
        setScoreData(JSON.stringify(response));
        console.log(response);
        setBeatmap(response.beatmap);
        setMisscount(Number(response.hits.miss));
        setMaxMisscount(Number(response.hits.miss) * 12);
        setActualPP(response.actualPP);
        setMods(response.mods ?? "none");
        setAccuracy(response.accuracy);
        setMaxPP(response.maxPP);
        setMaxCombo(response.maxcombo);
        setTotal(response.hits.ok + response.hits.meh + response.hits.great + response.hits.miss);
        setOk(response.hits.ok);
        setGreat(response.hits.great);
        setMeh(response.hits.meh);
        setRevealText(true);
    }

    const recalcData = async () => {
      let response= await fetch("http://localhost:3000/api/get_pp"+
      "?bID="+bID+
      "&misscount="+misscount+
      "&accuracy="+accuracy+
      "&mods="+mods+
      "&great="+great+
      "&ok="+oK+
      "&meh="+meh+
      "&total="+total+
      "&maxcombo="+maxCombo);
      response = await response.json();
      setActualPP(response.actualPP);
      setAccuracy(response.accuracy);
      setMisscount(Number(response.misscount));
      console.log(response);
    }
      //let response = await fetch("http://localhost:3000/api/get_score?bID=2496318&uID=754792");
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
            <h2>helloo</h2>
            <input type="text"
                value={bID}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="enter beatmap ID" />
            <input type="text"
                value={uID}
                onChange={(e) => setBody(e.target.value)}
                placeholder="enter user ID" />
                
            <button onClick={submitData}>Submit</button>{revealText ? <button onClick={recalcData}>recalc</button> : null}
            {revealText ? <div>
            
            <Box sx={{ width: 300 }}>
            <Slider onChange={(e) => setMisscount(e.target.value)} value={misscount} aria-label="secondary" valueLabelDisplay="auto" color="secondary" max={maxmisscount} />
            </Box>
            <p>beatmap: {beatmap}</p>
            <p>stats: {actualPP}/{maxPP}PP</p>
            <p>mods: {mods}</p>
            <p>accuracy: {accuracy}%, misscount: {misscount}, max combo: {maxCombo}</p>
            </div> : null}
         </main>
      </div>
    );
}