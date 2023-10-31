
import Head from 'next/head'
import React from "react";
import Row from "react-bootstrap/Row";
import { up, down, GetAccesToken} from "../../lib/reddit_upvote.js";
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

function array_chunk(arr, size) {
  let result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, size + i));
  }
  return result;
};

if(typeof String.prototype.replaceAll === "undefined") {
    String.prototype.replaceAll = function(match, replace) {
       return this.replace(new RegExp(match, 'g'), () => replace);
    }
}

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

  function MakeProgressBar(e) {
    let rect = document.createElement("div");
    rect.className = "progress";
    rect.style.height = "0.2rem";
    e.insertBefore(rect, e.querySelector('.card-body'));
    let bar = document.createElement("div");
    bar.className = "progress-bar";
    bar.id = "bar";
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-valuenow", "0");
    bar.setAttribute("aria-valuemin", "0");
    bar.setAttribute("aria-valuemax", "0");
    rect.appendChild(bar);
  }

  function handleTimeupdate(e) {
    if (e.target.parentNode.querySelectorAll('.progress > #bar').length != 1) {
      MakeProgressBar(e.target.parentNode)
    } else {
      let pers = ((e.target.currentTime / e.target.duration) * 100);
      e.target.parentNode.querySelector('.progress > #bar').style.width = `${Math.round(pers)}%`;
      e.target.parentNode.querySelector('.progress > #bar').setAttribute("aria-valuenow", `${Math.round(pers)}`);
    }
  }

  function ClickTimeLineHandler(e) {
	console.log(e)
	let procentVanFilmpje = e.nativeEvent.offsetX / e.target.clientWidth;
	console.log("procentVanFilmpje:", procentVanFilmpje);
	let filmpje = e.target.parentNode.parentNode.querySelector('video');
	filmpje.currentTime = procentVanFilmpje * filmpje.duration;
  }

  try {
    if (item.preview.hasOwnProperty('reddit_video_preview')) {
      //return <video className="card-img-top" controls  preload="auto" loop poster={item.preview.images[0].source.url.replaceAll("&amp;", "&")} width={item.preview.reddit_video_preview.width} height={item.preview.reddit_video_preview.height}>
      return (
        //onError={(err) =>(`An error occournd in the video tag: ${JSON.stringify(err)}`)}
        //onError={console.error}
        <div>
        <video className="card-img-top" preload="auto" poster={item.preview.images[0].source.url.replaceAll("&amp;", "&") ? item.preview.images[0].source.url.replaceAll("&amp;", "&").replaceAll("&amp;", "&") : item.preview.images[0].source.url.replaceAll("&amp;", "&").replaceAll("&amp;", "&") } muted onClick={handleClick} onTimeUpdate={handleTimeupdate} onDoubleClick={handleDoubleClick} onLoadStart={handleStart} onPause={handlePause} onPlay={handlePlay}>
        <source src={item.preview.reddit_video_preview.hls_url} />
        <source src={item.preview.reddit_video_preview.dash_url} />
        <source src={item.preview.reddit_video_preview.fallback_url} type="video/mp4"/>
        Your browser does not support the video tag.
        </video>
        <div className="progress" style={{ height: "0.2rem" }} onClick={ClickTimeLineHandler}><div className="progress-bar" id="bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="0"></div></div>
        </div>
        );
        //<div className="progress" style={{height: "0.2rem"}}>
        //  <div className="progress-bar" role="progressbar" id="bar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
        //</div>
      } else if (item.url.includes("gif")) {
        return (
          <div>
          <video className="card-img-top" preload="auto" poster={item.preview.images[0].source.url.replaceAll("&amp;", "&")} muted onClick={handleClick} onTimeUpdate={handleTimeupdate} onDoubleClick={handleDoubleClick} onLoadStart={handleStart} onPause={handlePause} onPlay={handlePlay}>
          <source src={item.preview.images[0].variants.mp4.source.url.replaceAll("&amp;", "&")} />
          Your browser does not support the video tag.
          </video>
          <div className="progress" style={{ height: "0.2rem" }} onClick={ClickTimeLineHandler}><div className="progress-bar" id="bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="0"></div></div>
          </div>
        );
      } else {
        return <Card.Img variant="top" src={item.url.replaceAll("&amp;", "&")} alt={item.alt} />;
      }
    } catch (e) {
       console.log("Er is een error", e);
	     console.log("Er is hier naar de catch gegaan, dus er is iets mis met deze url:", item);
      try {
        return <Card.Img variant="top" src={item.url.replaceAll("&amp;", "&")} alt={item.alt} />;
      } catch (e) {
        return <Card.Img variant="top" src={item.url.replaceAll("&amp;", "&")} alt={item.alt} />;
      }
    }
  }

  function FileItem(props) {
    function UpVote(argv) {
      up(argv, access_token);
    }

    function DownVote(argv) {
      down(argv, access_token);
    }

    function KeyBoardEvent(e) {
      console.log("The KeyBoardEvent() was called", e);
      if (e.code === 'ArrowRight') {
        // Skip forward here
        if (ElementIsPlaying.element != null && ElementIsPlaying.Playing) {
          // Check of er iets aan het afspelen is
          // Zo ja, dan het ander op pauze zetten
          // if (ElementIsPlaying.wasElement != null) { ElementIsPlaying.wasElement.pause(); }
          // Checken of je niet te ver vooruit gaat skippen.
          if (ElementIsPlaying.element.duration >= (ElementIsPlaying.element.currentTime + 1.0)) {
            if (e.shiftKey) {
              console.log("Added 0.25 second time, because shift is pressed", ElementIsPlaying.element.currentTime);
              ElementIsPlaying.element.currentTime += (event.altKey ? 0.0025 :0.025);
              ElementIsPlaying.element.play();
            } else {
              console.log("Added 1 second time");
              ElementIsPlaying.element.currentTime += 1.0;
              ElementIsPlaying.element.play();
            }
            // if (ElementIsPlaying.element.duration >= ElementIsPlaying.element.currentTime) { ElementIsPlaying.element.play() } else { ElementIsPlaying.element.pause() }
          } else {
            // Als je te ver vooruit zou skippen kom je terug bij het begin en zet je hem op pauze
            ElementIsPlaying.element.currentTime = 0.0;
            ElementIsPlaying.element.pause();
          }
          // Kijken of er niets aan het afspelen is en er iets heeft afgespeeld
        } else if (ElementIsPlaying.wasElement != null && !ElementIsPlaying.Playing) {
          // Kijken of het niet al afgelopen is of Je te ver naar voren skipt
          if (!ElementIsPlaying.wasElement.ended && (ElementIsPlaying.wasElement.duration >= (ElementIsPlaying.wasElement.currentTime + 1.0))) {
            if (e.shiftKey) {
              console.log("Added 0.25 second time, because shift is pressed");
              ElementIsPlaying.wasElement.currentTime += 0.25;
            } else {
              console.log("Added 1 second time");
              ElementIsPlaying.wasElement.currentTime += 1.0;
            }
          } else {
            // Als hij al geëndigd is dan weer terug naar het begin of als je te ver naar voren skipt ook terug naar het begin
            console.log("Stoping video");
            ElementIsPlaying.wasElement.currentTime = 0.0;
            ElementIsPlaying.wasElement.pause();
          }
        }
      } else if (e.code === 'ArrowLeft') {
        // Go skip backward here
        // Checken of er iets aan het afspelen is en of dat ook zo is
        if (ElementIsPlaying.element != null && ElementIsPlaying.Playing) {
          // Checken of je naar achter kan en niet te ver naar achter skipt
          if (ElementIsPlaying.element.currentTime > 1.0 || e.shiftKey) {
            if (e.shiftKey) {
              ElementIsPlaying.element.currentTime -= 0.25;
            } else {
              ElementIsPlaying.element.currentTime -= 1.0;
            }
          } else {
            console.log("Stoping video");
            ElementIsPlaying.element.currentTime = 0.0;
            ElementIsPlaying.element.pause();
          }
          // Kijken of er niets aan het afspelen is en er iets heeft afgespeeld
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
    }


    /*React.useEffect(() => {
      document.addEventListener("keyup", event => {
        KeyBoardEvent(event);
      });
    }, []);*/

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

    if (props.OnlyVideo && item.preview) {
      if (!item.preview.hasOwnProperty('reddit_video_preview')) {
        console.log(`Wanting OnlyVideo: ${props.OnlyVideo} and this is not so returning null`);
        return null;
      }
    }

    return (
      <Col sm>
      <Board/>
      {isVideo(item)}
      <Card.Body>
        <a herf={`https://www.reddit.com/user/${item.author}`}><Card.Title>{item.author}</Card.Title></a>
        <Card.Text>{item.title}</Card.Text>
        <Button href={item.permalink} variant="primary">View {item.preview ? (item.preview.reddit_video_preview ? 'video' : (item.url.includes('gif') ? 'gif' : 'image') ) : 'image'} on reddit</Button>
        <Button onClick={UpVote} onDoubleClick={DownVote} style={{ 'marginLeft':' 5px' }} name={item.name} variant="secondary">UpVote</Button>
        {subredditText(item)}
      </Card.Body>
      </Col>
      );
    }

    function subredditText(item) {
      return <Card.Text>{item.subreddit_name_prefixed}</Card.Text>
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
                return <FileItem OnlyVideo={props.OnlyVideo} value={data} key={String(Math.round((Math.random()*10000)+10))}/>
              })
            }
            </Row>
            ))
          }
          </Container>
          );
        }

        export async function getServerSideProps({ query }) {
          console.log("Query:", query); // reddit?r=gonemild&video=true&limit=50
                                        // reddit?u=queenlivia&video=true&limit=50
          let rQuery = "";
          if (Object.keys(query).length != 0) { console.log(`Er is een query met ${Object.keys(query)[0]}: ${query[Object.keys(query)[0]]}`) }
          let rReddit = String((Object.keys(query).length != 0) ? query[Object.keys(query)[0]] : "gonemild");
          let typeReddit = Object.keys(query)[0] == "u" ? "u" : "r";
      	  console.log("TypeReddit:", typeReddit);
      	  let OnlyVideo = !!(query["video"]);
          console.log("OnlyVideo:", OnlyVideo);
          if (Object.keys(query).length >= 2) {
            let howMuch = parseInt(query[Object.keys(query)[1]]);
            console.log("howMuch:", howMuch);
            if (howMuch % 4 == 0) {
              rQuery += `?limit=${howMuch}`
            } else if ((howMuch - 1) % 4 == 0) {
              rQuery += `?limit=${howMuch - 1}`
            } else if ((howMuch - 2) % 4 == 0) {
              rQuery += `?limit=${howMuch - 2}`
            } else if ((howMuch - 3) % 4 == 0) {
              rQuery += `?limit=${howMuch - 3}`
            } else if ((howMuch - 4) % 4 == 0) {
              rQuery += `?limit=${howMuch - 4}`
            }
          }
          console.time("Making api call");
	        console.log("url:",`https://api.reddit.com/${typeReddit}/${rReddit}${rQuery}`)
          // raw_json=1
          let Fdata = await fetch(`https://api.reddit.com/${typeReddit}/${rReddit}${rQuery}`, { headers: { 'User-Agent': 'nl.wittopkoning.box'}});
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
              access_token = await GetAccesToken()
              console.log("GettingAC", access_token);
              let data = Jdata["data"];
              console.log(JSON.stringify(Fdata));
              return {
                props: { Home: data, SubReddit: rReddit, accesstoken: access_token, onlyVideo: OnlyVideo }
              };
            }
          }
        };



        export default function Home(props) {
          let RList = props.Home.children;
          access_token = props.accesstoken;
          return (
		<>
            <Head>
            <title>{`Subreddit r/${props.SubReddit}`}</title>
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
            <FileList Rjson={RList} key="RaNdOmStRiNg" rReddit={props.SubReddit} OnlyVideo={props.onlyVideo} />
            </>
            );
          }

          class Board extends React.Component {
            constructor(props) {
              super(props);

              this.handleKeyboardEvent = this.handleKeyboardEvent.bind(this);
            }

            componentDidMount() {
              if (typeof document !== 'undefined') {
                document.addEventListener('keydown', this.handleKeyboardEvent, false);
                document.addEventListener('keyup', this.handleKeyboardEvent, false);
                document.addEventListener('keypress', this.handleKeyboardEvent, false);
              } else {
                console.log(`typeof document == 'undefined'`);
              }
            }

            componentWillUnmount() {
              if (typeof document !== 'undefined') {
                document.removeEventListener('keydown', this.handleKeyboardEvent, false);
                document.removeEventListener('keyup', this.handleKeyboardEvent, false);
                document.removeEventListener('keypress', this.handleKeyboardEvent, false);
              } else {
                console.log(`typeof document == 'undefined'`);
              }
            }

            handleKeyboardEvent(e) {
              //console.log(`Bonjour with event that is ${event.repeat}:`, event);
              if (e.code === 'ArrowRight') {
                if (ElementIsPlaying.element != null && ElementIsPlaying.Playing) {
                  if (ElementIsPlaying.element.duration >= (ElementIsPlaying.element.currentTime + 1.0)) {
                    if (e.shiftKey) {
                      console.log("Added 0.25 second time, because shift is pressed");
                      ElementIsPlaying.element.currentTime += (e.altKey ? 0.0025 : 0.025);
                      ElementIsPlaying.element.play();
                    } else {
                      console.log("Added 1 second time");
                      ElementIsPlaying.element.currentTime += 1.0;
                      ElementIsPlaying.element.play();
                    }
                  } else {
                    ElementIsPlaying.element.currentTime = 0.0;
                    ElementIsPlaying.element.pause();
                  }
                } else if (ElementIsPlaying.wasElement != null && !ElementIsPlaying.Playing) {
                  if (!ElementIsPlaying.wasElement.ended && (ElementIsPlaying.wasElement.duration >= (ElementIsPlaying.wasElement.currentTime + 1.0))) {
                    if (e.shiftKey) {
                      console.log("Added 0.25 second time, because shift is pressed");
                      ElementIsPlaying.wasElement.currentTime += 0.25;
                    } else {
                      console.log("Added 1 second time");
                      ElementIsPlaying.wasElement.currentTime += 1.0;
                    }
                  } else {
                    console.log("Stoping video");
                    ElementIsPlaying.wasElement.currentTime = 0.0;
                    ElementIsPlaying.wasElement.pause();
                  }
                }
              } else if (e.code === 'ArrowLeft') {
                if (ElementIsPlaying.element != null && ElementIsPlaying.Playing) {
                  if (ElementIsPlaying.element.currentTime > 1.0 || e.shiftKey) {
                    if (e.shiftKey) {
                      ElementIsPlaying.element.currentTime -= 0.25;
                    } else {
                      ElementIsPlaying.element.currentTime -= 1.0;
                    }
                  } else {
                    console.log("Stoping video");
                    ElementIsPlaying.element.currentTime = 0.0;
                    ElementIsPlaying.element.pause();
                  }
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
            }

            render() {
              return <p></p>;
            }
          }
