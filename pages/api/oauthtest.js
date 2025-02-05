const url = new URL(
    "https://osu.ppy.sh/oauth/authorize"
);

const params = {
    "client_id": "37999",
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