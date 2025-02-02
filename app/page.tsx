'use client'

import React, { useState } from "react";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import './globals.css';

export default function Home() {
    const [bID, setTitle] = useState('')
    const [uID, setBody] = useState('')
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
        //let response= await fetch("https://osutest-pink.vercel.app/api/get_score?bID="+bID+"&uID="+uID);
        //let response = await fetch("http://localhost:3000/api/get_score?bID=2496318&uID=754792");
        let response = await fetch("https://osucalc-891757656779.us-east1.run.app/api/get_score?bID="+bID+"&uID="+uID);
        
        response = await response.json();
        let responseArray: any[] = [];
        Object.values(response).map(x => {responseArray.push(x)});
        console.log(responseArray);  

        setBeatmap(responseArray[0]);
        setMisscount(Number(responseArray[4].miss));
        setMaxMisscount(Number(responseArray[4].miss) * 12);
        setActualPP(responseArray[2]);
        setMods(responseArray[3] ?? "none");
        setAccuracy(responseArray[7]);
        setMaxPP(responseArray[1]);
        setMaxCombo(responseArray[6]);
        setTotal(responseArray[4].great + responseArray[4].meh + responseArray[4].ok + responseArray[4].miss);
        setOk(responseArray[4].ok);
        setGreat(responseArray[4].great);
        setMeh(responseArray[4].meh);
        setRevealText(true);
    }

    const recalcData = async () => {
      /*
      let response= await fetch("https://osutest-pink.vercel.app/api/get_pp"+
        "?bID="+bID+
        "&misscount="+misscount+
        "&accuracy="+accuracy+
        "&mods="+mods+
        "&great="+great+
        "&ok="+oK+
        "&meh="+meh+
        "&total="+total+
        "&maxcombo="+maxCombo);
        */
      
      let response= await fetch("https://osucalc-891757656779.us-east1.run.app/api/get_pp"+
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
      let responseArray: any[] = [];
      Object.values(response).map(x => {responseArray.push(x)})
      setActualPP(responseArray[0]);
      setAccuracy(responseArray[2]);
      setMisscount(Number(responseArray[1]));
      console.log(response);
    }
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
            <Slider value={misscount} onChange={(e: any) => setMisscount(e.target.value)} aria-label="secondary" valueLabelDisplay="auto" color="secondary" max={maxmisscount} />
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