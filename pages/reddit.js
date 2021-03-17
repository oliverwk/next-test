import Head from 'next/head'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
let rReddit = "GoneMild";

function array_chunk(arr, size) {
  let result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, size + i));
  }

  return result;
};
function isVideo(item) {
  try {
    if (item.preview.hasOwnProperty('reddit_video_preview')) {
      return <video className="card-img-top" controls poster={item.preview.images[0].source.url.replaceAll("&amp;", "&")} height={item.preview.reddit_video_preview.width} width={item.preview.reddit_video_preview.height}>
      <source src={item.preview.reddit_video_preview.hls_url} />
      <source src={item.preview.reddit_video_preview.dash_url} />
      <source src={item.preview.reddit_video_preview.fallback_url} type="video/mp4"/>
      Your browser does not support the video tag.
    </video>;
    } else {
      return <Card.Img variant="top" src={item.url.replaceAll("&amp;", "&")} alt={item.alt} />;
    }
  } catch (e) {
    console.log(e);
    try {
      return <Card.Img variant="top" src={item.url.replaceAll("&amp;", "&")} alt={item.alt} />;
    } catch (e) { 
      console.log(e);
      return <Card.Img variant="top" src={item.url} alt={item.alt} />;
    }
  }
}
function FileItem(props) {
  console.log(props.value);
  let item = props.value.data;
  console.log("Title Orginal:", item.title);
  if (!item.title) {
    item.title = "Geen titel"
  } else { 
    if (item.title.includes("[")) {
      let titleP1 = item.title.slice(item.title.indexOf("]")+1, item.title.length)
      let titleP2 = item.title.slice(0, Math.abs(item.title.indexOf("[")));
      item.title  = titleP2+titleP1;
    console.log("Title Editedd:"+titleP2+titleP1);
    } else if (item.title.includes("(")) {
      let titleP1 = item.title.slice(item.title.indexOf(")")+1, item.title.length)
      let titleP2 = item.title.slice(0, Math.abs(item.title.indexOf("(")));
      item.title  = titleP2+titleP1;
      item.alt    = titleP2+titleP1;
      console.log("Title Editedd:"+titleP2+titleP1);
    } else {
      console.log("Nothing in the title");
    }
  }
  if (item.preview.images[0].source.url) {
    // TEMP: ALS Afbeeldingen niet werken console.log("item.preview.images[0]:", item.preview);
    item.url = item.preview.images[0].source.url;
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
      item.permalink = item.permalink.includes('https://reddit.com') ? item.permalink : "https://reddit.com"+item.permalink
    }
  } else {
    item.permalink = item.permalink.includes('https://reddit.com') ? item.permalink : "https://reddit.com"+item.permalink
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
      <Card.Title>{item.author}</Card.Title>
      <Card.Text>{item.title.replaceAll("&lt;","<").replaceAll("&amp;","&")}</Card.Text>
      <Button href={item.permalink} variant="primary">View the Image on reddit</Button>
    </Card.Body>
  </Col>
  );
}

//export async function getStaticProps() {
export async function getServerSideProps({ query }) {
  if (Object.keys(query).length != 0) { console.log(`Er is een query met ${Object.keys(query)[0]}: ${query[Object.keys(query)[0]]}`) }
  rReddit = (Object.keys(query).length != 0) ? query[Object.keys(query)[0]] : 'gonemild';
  console.time("Making api call");
  let data = await fetch(`https://api.reddit.com/r/${rReddit}`, { headers: { 'User-Agent': 'Mozilla/5.1 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.3 Safari/604.1.15'}});
  if (!data.ok) {
  		console.log(data.statusCode);
  		console.log(data.statusText);
  }
  data = await data.json();
  data = data["data"];
  console.log(data["children"][6]["data"]["url_overridden_by_dest"]);
  console.timeEnd("Making api call");
  return {
    props: { Home: data },
  };
};

const FileList = (props) => {
    console.log("Props:", props);
    let mtp = props.Rjson.filter(data => {
        return data.data.stickied !== true;
     });
    let rows = array_chunk(mtp.slice(0, -1), 4);
  return (
    <Container fluid>
    <br/>
    <h1>The subreddit: <kbd>r/{rReddit}</kbd></h1>
    <br/>
     {
       rows.map((row) => (
         <Row>
         {
        row.map((data) => (
            <FileItem key={data.data.url.toString()} value={data} />
           ))
         }
         </Row>
       ))
     }
     </Container>
   );
}
export default function Home(props) {
  let RList = props.Home.children;
  return (
    <>
    <Head>
        <title>Subreddit r/{rReddit}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
        <meta name="apple-mobile-web-app-title" content="reddit"/>
        <link rel="manifest" href="./manifest.json"/>
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
    <FileList Rjson={RList}/>
    </>
    );
}
