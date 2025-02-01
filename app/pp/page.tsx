import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button';
import React from "react";
import axios from 'axios';
async function serve(){
  const response = await axios.get("http://localhost:3000/api/pp?bID=4772470&uID=754792");
  return response.data;
}

export default async function Page({
}) {

  let fetchData2 = {
    beatmap: "none!",
    actualPP: 69,
    maxPP: 420,
    mods: [ "HD", "DT"]
  };
  let fetchData = await serve();
  let beatmap = fetchData.beatmap;
  let actualPP = fetchData.actualPP;
  let maxPP = fetchData.maxPP;
  let mods = fetchData.mods;
  //console.log(response);
  return (
    <main>
      <p>hey man</p>
      <p>number of misses: {}</p>
      <p>calculating: {beatmap}</p>
      <p>pp: {actualPP}/{maxPP}</p>
      <p>mods: {mods}</p>
    </main>
  )
}