'use client';

//import { v2, auth } from 'osu-api-extended';
import axios from 'axios'
import { useState } from 'react';
//import rosu from '../node_modules/osu-api-extended/dist/index';
const AccessToken = "60348d3b2746d774c89c4c9b62830023a056d72f";
const clientSecret = "Z77zfBSChTA1tJBxhWJErI8teMrXad6UqTOf1Wn0";
const clientIDv2 = 36823;
export default function fart() {
    const [numberOne, setOne] = useState("none");
    async function handleFart(){
        const res = await axios.get("https://osu.ppy.sh/api/get_scores?k="+AccessToken+"&b=4704306&mods=0");
        const scores = res.data;
        console.log(scores[0].username);
        setOne(scores[0].username)
    }
    return <button onClick={handleFart}> ({numberOne})</button>;
};
