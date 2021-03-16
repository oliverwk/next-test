import Head from 'next/head'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Link from 'next/link';
import { boxGetFolder } from '../lib/boxes.js';


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (array.length));
        //[array[i], array[j]] = [array[j], array[i]];
        [array[i]["download_url"],  array[j]["download_url"]]  = [array[j]["download_url"],  array[i]["download_url"]];
        [array[i]["id"],   array[j]["id"]]   = [array[j]["id"],   array[i]["id"]];
        [array[i]["name"], array[j]["name"]] = [array[j]["name"], array[i]["name"]];
    }
    return array;
}


function FileItem(props) {
  let items = props.value;
  let ndate = new Date(parseInt(items.name)*1000);
  return (
     <Col md="4">
     <Card.Img variant="top" src={items.download_url} alt={items.name} />
      <Card.Body>
        <Card.Title>{ndate != "Invalid Date" ?  ndate.toLocaleString("nl-nl") : items.name}</Card.Title>
          <Link href={ "/file/" + items.id }>
            <Button variant="primary">View the Image</Button>
          </Link>
      </Card.Body>
     </Col>
  );
}

//export async function getStaticProps() {
export async function getServerSideProps({ query }) {
  if (Object.keys(query).length != 0) { console.log(`Er is een query met ${Object.keys(query)[0]}: ${query[Object.keys(query)[0]]}`) }
  console.time("Calling box api");
  let datas = await boxGetFolder();
  let data  = await shuffleArray(datas.entries);
  console.timeEnd("Calling box api");
  data = data.length ? data.slice(30) : data;
  return {
    props: { Home: data },
  };
}

//TODO: dit hier boven toeveoge voor isg revalidate: 30,
const FileList = (props) => {
  return (
    <Container fluid>
      <br/>
      <h1>Instagram of: <kbd>waitingforbeauty</kbd></h1>
      <br/>
      <Row>
        {props.fileList.map((file, i) =>
          <FileItem key={i.toString()} value={file} />
        )}
      </Row>
    </Container>
  );
}
export default function Home(props) {
  let fileslist = props.Home;
  return (
    <>
    <Head>
      <title>Box next.js</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" crossOrigin="anonymous"></link>
    </Head>
      <FileList fileList={fileslist}/>
    </>
  );
}
