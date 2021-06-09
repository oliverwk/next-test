import Head from 'next/head'
import { useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

let ElementIsPlaying = {
  Playing: false,
  element: null,
  wasElement: null
};
let access_token;
let accessToken;

function array_chunk(arr, size) {
  let result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, size + i));
  }
  return result;
};

function isVideo(item) {
  function handleClick(e) {
    if (e.target.ended) {
      e.target.currentTime = 0;
    } else {
      if (e.target.paused) {
        e.target.play()
      } else {
        e.target.pause()
      }
    }
  }

  function handleStart(e) {
    e.target.loop = false;
  }

  function handleDoubleClick(e) {
    console.log("EventDoubleClick:", e);
    //See if the video is playing
    if (!e.target.paused || !e.target.ended) {
      console.log((e.target.offsetWidth / 2 > e.clientX - e.target.getBoundingClientRect().left) ? "links" : "rechts");
      if (e.target.offsetWidth / 2 > e.clientX - e.target.getBoundingClientRect().left) {
        //Left
        e.target.currentTime -= 2;
      } else {
        e.target.currentTime += 2;
      }
    } else {
      e.target.currentTime = 0;
    }
  }

  function handlePlay(e) {
    ElementIsPlaying.Playing = true;
    ElementIsPlaying.element = e.target;
    if (ElementIsPlaying.wasElement === e.target) {
      ElementIsPlaying.wasElement = null;
    }
  }

  function handlePause(e) {
    ElementIsPlaying.Playing = false;
    ElementIsPlaying.element = null;
    ElementIsPlaying.wasElement = e.target;
  }

  function handleTimeupdate(e) {
    if (e.target.parentNode.querySelectorAll('div').length === 1) {
      let rect = document.createElement("div");
      rect.className = "progress";
      rect.style.height = "0.2rem";
      e.target.parentNode.appendChild(rect);
      let bar = document.createElement("div");
      bar.className = "progress-bar";
      bar.id = "bar";
      bar.setAttribute("role", "progressbar");
      bar.setAttribute("aria-valuenow", "0");
      bar.setAttribute("aria-valuemin", "0");
      bar.setAttribute("aria-valuemax", "0");
      rect.appendChild(bar);
    } else {
      let per = ((e.target.currentTime / e.target.duration) * 100);
      e.target.parentNode.querySelector('.progress > #bar').style.width = `${Math.round(per)}%`;
      e.target.parentNode.querySelector('.progress > #bar').setAttribute("aria-valuenow", String(Math.round(per)));
    }
  }

  try {
    if (item.preview.hasOwnProperty('reddit_video_preview')) {
      //return <video className="card-img-top" controls  preload="auto" loop poster={item.preview.images[0].source.url.replaceAll("&amp;", "&")} width={item.preview.reddit_video_preview.width} height={item.preview.reddit_video_preview.height}>
      return (
        //onError={(err) =>(`An error occournd in the video tag: ${JSON.stringify(err)}`)}
        //onError={console.error}
        <>
          <video className="card-img-top" preload="auto" poster={item.preview.images[0].source.url.replaceAll("&amp;", "&") ? item.preview.images[0].source.url.replaceAll("&amp;", "&") : item.preview.images[0].source.url } muted onClick={handleClick} onTimeUpdate={handleTimeupdate} onDoubleClick={handleDoubleClick} onLoadStart={handleStart} onPause={handlePause} onPlay={handlePlay}>
            <source src={item.preview.reddit_video_preview.hls_url} />
            <source src={item.preview.reddit_video_preview.dash_url} />
            <source src={item.preview.reddit_video_preview.fallback_url} type="video/mp4"/>
            Your browser does not support the video tag.
          </video>
          <div className="progress" style={{height: "0.2rem"}}>
            <div className="progress-bar" role="progressbar" id="bar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </>
      );
    } else {
      return <Card.Img variant="top" src={item.url.replaceAll("&amp;", "&") ? item.url.replaceAll("&amp;", "&") : item.url} alt={item.alt} />;
    }
  } catch (e) {
    try {
      return <Card.Img variant="top" src={item.url.replace("&amp;", "&")} alt={item.alt} />;
    } catch (e) {
      return <Card.Img variant="top" src={item.url} alt={item.alt} />;
    }
  }
}

function FileItem(props) {
  async function UpVote(argv) {
    // example: t3_no45bb
    // https://www.reddit.com/dev/api/#fullnames
    // example comment: t1_gzw9qdv
    console.log("Name:", argv.target.name);
    let name = argv.target.name
    if (!access_token) {
      let accesTokenRes = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic N2NaMFhYamowYnFHMWc6TDBiOWR3MTFkZW0xbnV1dHhpQ1ZuWnAwWS1xbmRn'
        },
        body: 'grant_type=password&username=coffe-cup-404&password=nybtun-riwvi2-Tepkaw'
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
      let accesTokenRes = await fetch('https://www.reddit.com/api/v1/access_token', { method: 'POST', headers: { 'Authorization': 'Basic N2NaMFhYamowYnFHMWc6TDBiOWR3MTFkZW0xbnV1dHhpQ1ZuWnAwWS1xbmRn' }, body: 'grant_type=password&username=coffe-cup-404&password=nybtun-riwvi2-Tepkaw' });
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
  useEffect(() => {
    document.addEventListener("keyup", event => {
      if (event.code === 'ArrowRight') {
        //Go skip forward here
        if (ElementIsPlaying.element != null && ElementIsPlaying.Playing) {
        //Check of er iets aan het afspelen is
          //Zo ja, dan het ander op pauze zetten
                //if (ElementIsPlaying.wasElement != null) { ElementIsPlaying.wasElement.pause(); }
          //Checken of je niet te ver vooruit gaat skippen.
          if (ElementIsPlaying.element.duration >= (ElementIsPlaying.element.currentTime + 1.0)) {
              console.log("Added 1 second time");
              ElementIsPlaying.element.currentTime += 1.0;
              //if (ElementIsPlaying.element.duration >= ElementIsPlaying.element.currentTime) { ElementIsPlaying.element.play() } else { ElementIsPlaying.element.pause() }
          } else {
            //Als je te ver vooruit zou skippen kom je terug bij het begin en zet je hem op pauze
            ElementIsPlaying.element.currentTime = 0.0;
            ElementIsPlaying.element.pause();
          }
          //Kijken of er niets aan het afspelen is en er iets heeft afgespeeld
          } else if (ElementIsPlaying.wasElement != null && !ElementIsPlaying.Playing) {
          //Kijken of het niet al afgelopen is of Je te ver naar voren skipt
          if (!ElementIsPlaying.wasElement.ended && (ElementIsPlaying.wasElement.duration >= (ElementIsPlaying.wasElement.currentTime + 1.0))) {
            console.log("Added 1 second time");
            ElementIsPlaying.wasElement.currentTime += 1.0;
          } else {
            //Als hij al geëndigd is dan weer terug naar het begin of als je te ver naar voren skipt ook terug naar het begin
            console.log("Stoping video");
            ElementIsPlaying.wasElement.currentTime = 0.0;
            ElementIsPlaying.wasElement.pause();
          }
        }
      } else if (event.code === 'ArrowLeft') {
        //Go skip backward here
        //Checken of er iets aan het afspelen is en of dat ook zo is
        if (ElementIsPlaying.element != null && ElementIsPlaying.Playing) {
          //Checken of je naar achter kan en niet te ver naar achter skipt
          if (ElementIsPlaying.element.currentTime > 1.0) {
            ElementIsPlaying.element.currentTime -= 1.0;
          } else {
            console.log("Stoping video");
            ElementIsPlaying.element.currentTime = 0.0;
            ElementIsPlaying.element.pause();
          }
        //Kijken of er niets aan het afspelen is en er iets heeft afgespeeld
        } else if (ElementIsPlaying.wasElement != null && !ElementIsPlaying.Playing) {
          if (ElementIsPlaying.wasElement.currentTime > 1.0) {
            ElementIsPlaying.wasElement.currentTime -= 1.0;
          } else {
            console.log("Stoping video");
            ElementIsPlaying.wasElement.currentTime = 0.0;
            ElementIsPlaying.wasElement.pause();
          }
        }
      }
    });
  }, []);

  let item = props.value.data;
  console.log("Title Orginal:", item.title);
  if (!item.title) {
    item.title = "Geen titel"
  } else {
    if (item.title.includes("[")) {
      let titleP1 = item.title.slice(item.title.indexOf("]")+1, item.title.length)
      let titleP2 = item.title.slice(0, Math.abs(item.title.indexOf("[")));
      item.title  = titleP2+titleP1;
      console.log("Title Editedd:", titleP2+titleP1);
    } else if (item.title.includes("(")) {
      let titleP1 = item.title.slice(item.title.indexOf(")")+1, item.title.length)
      let titleP2 = item.title.slice(0, Math.abs(item.title.indexOf("(")));
      item.title  = titleP2+titleP1;
      item.alt    = titleP2+titleP1;
      console.log("Title Editedd:", titleP2+titleP1);
    } else if (item.title.includes("&amp;")) {
      item.title = item.title.replace("&amp;", "&");
      item.alt = item.title.replace("&amp;", "&");
    }
  }
  try {
    if (item["preview"]["images"][0]["source"]["url"]) {
      // TEMP: ALS Afbeeldingen niet werken console.log("item.preview.images[0]:", item.preview);
      item.url = item.preview.images[0].source.url;
    }
  } catch (error) {
    console.log(item)
  }


  /* FIXME: als thumbnails van andre websites niet meer werken dan dit gebruiken
  if (!item.is_reddit_media_domain) {
    item.url = item.thumbnail
  }
  */

  if (item.hasOwnProperty('media_metadata')) {
    item.url = item["media_metadata"][Object.keys(item.media_metadata)[0]]["s"]["u"]
  }
  if (item.hasOwnProperty('preview')) {
    console.log("Video", item.preview.hasOwnProperty('reddit_video_preview'));
    if (item.preview.hasOwnProperty('reddit_video_preview')) {
      item.permalink = item.preview.reddit_video_preview.fallback_url
      item.url = item.preview.images[0].source.url
    } else {
      item.permalink = item.permalink.startsWith('https://reddit.com') ? item.permalink : `https://reddit.com${item.permalink}`
    }
  } else {
    item.permalink = item.permalink.startsWith('https://reddit.com') ? item.permalink : `https://reddit.com${item.permalink}`
  }
  if (!item.url) {
    item.url = "#";
  }
  if (!item.title) {
    item.title = "No title"
  }
  return (
    <Col sm>
      {isVideo(item)}
      <Card.Body>
        <a herf={`https://www.reddit.com/user/${item.author}`}><Card.Title>{item.author}</Card.Title></a>
      <Card.Text>{item.title}</Card.Text>
        <Button href={item.permalink} variant="primary">View the Image on reddit</Button>
        <Button onClick={UpVote} style={{ 'margin-left':' 5px' }} name={item.name} variant="secondary">UpVote</Button>
      </Card.Body>
    </Col>
    );
  }
  function FileList(props) {
    console.log("Props:", props);
    let mtp = props.Rjson.filter(data => {
      return data.data.stickied !== true;
    });

    let rows = array_chunk(mtp.slice(0, -1), 4);
    return (
      <Container fluid>
        <br />
        <h1>The subreddit: <kbd>r/{props.rReddit}</kbd></h1>
        <br />
        {
          rows.map((row, imt) => (
            <Row key={String(Math.round((Math.random()*10000)+10))}>
              {
                row.map((data, i) => {
                  return <FileItem value={data} key={String(Math.round((Math.random()*10000)+10))}/>
                })
              }
            </Row>
          ))
        }
      </Container>
    );
  }

        export async function getServerSideProps({ query }) {
          console.log("Query:", query);
          let rQuery = "";
          if (Object.keys(query).length != 0) { console.log(`Er is een query met ${Object.keys(query)[0]}: ${query[Object.keys(query)[0]]}`) }
          let rReddit = String((Object.keys(query).length != 0) ? query[Object.keys(query)[0]] : "gonemild");
          if (Object.keys(query).length >= 2) {
            let howMuch = parseInt(query[Object.keys(query)[1]]);
            console.log("howMuch:", howMuch);
            rQuery += `?limit=${howMuch}`
          }
          console.time("Making api call");
          //raw_json=1
          let Fdata = await fetch(`https://api.reddit.com/r/${rReddit}${rQuery}`, { headers: { 'User-Agent': 'nl.wittopkoning.box'}});
          if (!Fdata.ok) {
            console.log(Fdata.status);
            console.log(Fdata.statusText);
            return { notFound: true };
          } else {
            let Jdata = await Fdata.json();
            if (Jdata.data.children.length == 0) {
              console.log("Not Found")
              console.timeEnd("Making api call");
              console.log(Fdata.status);
              return { notFound: true };
            } else {
              console.timeEnd("Making api call");
              let data = Jdata["data"];
              console.log(JSON.stringify(Fdata));
              return {
                props: { Home: data, SubReddit: rReddit }
              };
            }
          }
        };

        export default function Home(props) {
          let RList = props.Home.children;
          return (
            <>
            <Head>
            <title>Subreddit r/{props.SubReddit}</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
            <meta name="apple-mobile-web-app-title" content="reddit"/>
            <link rel="manifest" href="manifest.json"/>
            <meta property="og:image:secure_url" content="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png"/>
            <meta property="og:image:alt" content="reddit logo"/>
            <link rel="apple-touch-icon" sizes="57x57" href="https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-57x57.png" />
            <link rel="apple-touch-icon" sizes="60x60" href="https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-60x60.png" />
            <link rel="apple-touch-icon" sizes="72x72" href="https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-72x72.png" />
            <link rel="apple-touch-icon" sizes="76x76" href="https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-76x76.png" />
            <link rel="apple-touch-icon" sizes="114x114" href="https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-114x114.png" />
            <link rel="apple-touch-icon" sizes="120x120" href="https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-120x120.png" />
            <link rel="apple-touch-icon" sizes="144x144" href="https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-144x144.png" />
            <link rel="apple-touch-icon" sizes="152x152" href="https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-152x152.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-180x180.png" />
            <link rel="icon" type="image/png" sizes="192x192" href="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="96x96" href="https://www.redditstatic.com/desktop2x/img/favicon/favicon-96x96.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="https://www.redditstatic.com/desktop2x/img/favicon/favicon-16x16.png" />
            <meta property="og:type" content="website"/>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" crossOrigin="anonymous"></link>
            </Head>
            <FileList Rjson={RList} key="RaNdOmStRiNg" rReddit={props.SubReddit} />
            </>
            );
          }
