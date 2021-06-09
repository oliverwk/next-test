let access_token;
let accessToken;
export let up = async (argv) => {
  // example: t3_no45bb
  // https://www.reddit.com/dev/api/#fullnames
  // example comment: t1_gzw9qdv
  console.log("Name:", argv.target.name);
  let name = argv.target.name
  if (!access_token) {
    console.log(process.env);
    let accesTokenRes = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic '+process.env.REDDIT_PASSWORD_BASIC
      },
      body: `grant_type=password&username=coffe-cup-404&password=${process.env.REDDIT_PASSWORD}`
    });
    accessToken = await accesTokenRes.json();
    access_token = accessToken.access_token;
  }

  let VoteRes = await fetch('https://oauth.reddit.com/api/vote', {
    method: 'POST',
    headers: {
      //'user-agent': 'nl.wittopkoning.box',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `bearer ${access_token}`
    },
    body: `id=${name}&dir=1&api_type=json` //rank ????
  });

  if (VoteRes.status === 403) {
    console.log("The Vote was unauthrized", VoteRes.status);
    let accesTokenRes = await fetch('https://www.reddit.com/api/v1/access_token', { method: 'POST', headers: { 'Authorization': 'Basic '+process.env.REDDIT_PASSWORD_BASIC }, body: `grant_type=password&username=coffe-cup-404&password=${process.env.REDDIT_PASSWORD}` });
    accessToken = await accesTokenRes.json();
    access_token = accessToken.access_token;
    VoteRes = await fetch('https://oauth.reddit.com/api/vote', { method: 'POST', headers: {'Authorization': `bearer ${access_token}`,
      'Content-Type': 'application/x-www-form-urlencoded' },
      body: `id=${name}&dir=1`
    });
  }
  console.log(VoteRes.status);
  if (VoteRes.ok) {
    argv.target.className = "btn btn-success"
  } else {
    argv.target.className = "btn btn-danger"
  }
}
