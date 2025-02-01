import { tools, v2, auth } from '../node_modules/osu-api-extended/dist/bundle.js';
//import rosu from '../node_modules/osu-api-extended/dist/index';
const AccessToken = "60348d3b2746d774c89c4c9b62830023a056d72f";
const clientSecret = "Z77zfBSChTA1tJBxhWJErI8teMrXad6UqTOf1Wn0";
const clientIDv2 = 36823;
alert("kil yourself");
async function main() {
    try {
        await auth.login({                  
          type: 'v2',
          client_id: clientIDv2,
          client_secret: clientSecret,
          cachedTokenPath: './test.json' // path to the file your auth token will be saved (to prevent osu!api spam)
        });
    
        const result = await v2.beatmaps.details({
          type: 'difficulty',
          id: 1199955
        });
        if (result.error != null) {
          console.log(result.error);
          return;
        };
    
        console.log(result);
      } catch (error) {
        console.log(error);
      };
  }
 main();
