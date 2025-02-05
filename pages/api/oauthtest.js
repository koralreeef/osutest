const {CLIENT_SECRET, CLIENT_IDV2} = process.env;
const clientIDv2 = CLIENT_IDV2;

const url = new URL(
    "https://osu.ppy.sh/oauth/authorize"
);

const params = {
    "client_id": clientIDv2,
    "redirect_uri": "https://osucalc-891757656779.us-east1.run.app/",
    "response_type": "code",
    "scope": "public identify",
    "state": "randomval",
};
Object.keys(params)
    .forEach(key => url.searchParams.append(key, params[key]));

fetch(url, {
    method: "GET",
}).then(response => console.log(response.url));