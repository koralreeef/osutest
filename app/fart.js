//import { v2, auth } from 'osu-api-extended';
import rosu from 'rosu-pp-js';
//import rosu from '../node_modules/osu-api-extended/dist/index';
const AccessToken = "60348d3b2746d774c89c4c9b62830023a056d72f";
const clientSecret = "Z77zfBSChTA1tJBxhWJErI8teMrXad6UqTOf1Wn0";
const clientIDv2 = 36823;
export default function fart() {
    try {
        auth.login({                  
          type: 'v2',
          client_id: clientIDv2,
          client_secret: clientSecret,
          cachedTokenPath: './test.json' // path to the file your auth token will be saved (to prevent osu!api spam)
        });
    
        const result = v2.scores.details({
          type: 'difficulty',
          id: 4767897389,
        });
    
        console.log(result);
        return <button onClick={fart}>poo </button>;
      } catch (error) {
        console.log(error);
        return <button onClick={fart}>poo </button>;
      };
      
  }
