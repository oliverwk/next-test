export let GetAccesToken = () => {
  return new Promise(async(resolve, reject) => {
    let accesTokenRes = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic '+process.env.REDDIT_PASSWORD_BASIC
      },
      body: `grant_type=password&username=coffe-cup-404&password=${process.env.REDDIT_PASSWORD}`
    });
    if (accesTokenRes.ok) {
      let accessToken = await accesTokenRes.json();
      resolve(accessToken.access_token);
    } else {
      reject(false)
    }
  });
}

export let up = async (argv, ac) => {
  // example: t3_no45bb
  // https://www.reddit.com/dev/api/#fullnames
  // example comment: t1_gzw9qdv
  console.log("Name:", argv.target.name);
  console.log("accessTokenLL", ac);
  let name = argv.target.name
  let VoteRes = await fetch('https://oauth.reddit.com/api/vote', {
    method: 'POST',
    headers: {
      //'user-agent': 'nl.wittopkoning.box',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `bearer ${ac}`
    },
    body: `id=${name}&dir=1&api_type=json` //rank ????
  });

  console.log(VoteRes.status);
  if (VoteRes.ok) {
    argv.target.className = "btn btn-success"
  } else {
    argv.target.className = "btn btn-danger"
  }
}
