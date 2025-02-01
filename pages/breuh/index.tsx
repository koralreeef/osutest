import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button';
import React, { useState } from "react";
import axios from 'axios';
async function serve(){
  const response = await axios.get("http://localhost:3000/api/pp?bID=4869472&uID=24419335");
  return response.data;
}

export default function Page({
}) {
  let [beatmapID, setBeatmapID] = useState<any | null>(null);
  let [frontbmID, setFrontbmID] = useState<any | null>(null);
  let [userID, setUserID] = useState<any | null>(0);
  let [frontuserID, setFrontuserID] = useState<any | null>(0);
  let [misscount, setMisscount] = useState<any | null>(0);
  let [frontmisscount, setfrontmisscount] = useState<any | null>(0);

  let fetchData = {
    beatmap: "none!",
    actualPP: 69,
    maxPP: 420,
    mods: [ "HD", "DT"]
  };
  let beatmap = fetchData.beatmap;
  let actualPP = fetchData.actualPP;
  let maxPP = fetchData.maxPP;
  let mods = fetchData.mods;
  //console.log(response);
  return (
    <main>
        <div className="card flex justify-content-center">
            <div className="w-14rem">
                <Button onClick={() => setFrontbmID(beatmapID)} label="enter" />
                <InputText value={beatmapID} onChange={(e) => setBeatmapID(e.target.value)} keyfilter="int" placeholder="enter beatmapID"  />
            </div>
        </div>
        <div className="card flex justify-content-center">
            <div className="w-14rem">
                <Button onClick={() => setFrontuserID(userID)} label="enter" />
                <InputText value={beatmapID} onChange={(e) => setUserID(e.target.value)} keyfilter="int" placeholder="enter userID"  />
            </div>
        </div>
        <div className="card flex justify-content-center">
            <div className="w-14rem">
                <Button onClick={() => setfrontmisscount(misscount)} label="enter" />
                <InputText value={beatmapID} onChange={(e) => setUserID(e.target.value)} keyfilter="int" placeholder="enter misscount"  />
            </div>
        </div>
        <div className="card flex justify-content-center">
            <div className="w-14rem">
                <Button onClick={() => setfrontmisscount(misscount)} label="enter" />
                <InputText value={beatmapID} onChange={(e) => setUserID(e.target.value)} keyfilter="int" placeholder="enter misscount"  />
            </div>
        </div>
      <p>hey man</p>
      <p>number of misses: {}</p>
      <p>calculating: {beatmap}</p>
      <p>pp: {actualPP}/{maxPP}</p>
      <p>mods: {mods}</p>
    </main>
  )
}