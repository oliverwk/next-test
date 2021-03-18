import Head  from 'next/head'
import Link  from 'next/link'
import { boxGetFolder } from '../lib/boxes.js'

let user = { "name" : "oliverwk" };
let id = 114207700943;
function FileItem(props) {
  let items = props.value;
  console.log("Items",items);
  return (
    <div className="col-sm-4">
     <li className="card">
        <img src={items.download_url} alt={items.name} className="card-img-top" style={{ padding: 10 + 'px' }} id={items.id} />
       <div className="card-body">
         <h5 className="card-title">{items.name}</h5>
         <a href={"https://app.box.com/file/"+items.id} className="btn btn-primary">View the Image</a>
        </div>
     </li>
    </div>
  );
}
export async function getStaticProps() {
  console.time("Calling box api");
  let fileList = await boxGetFolder(id);
  fileList = fileList.length ? fileList.slice(30) : fileList;
  console.timeEnd("Calling box api");
  return {
    props: { FileList: fileList },
    revalidate: 30,
  };
};

const FileList = (props) => {
    console.log("Props:", props);
    return (
      <ul className="row">
        {props.fileList.map((file) =>
          <FileItem key={file.id.toString()} value={file} />
        )}
      </ul>
    );
}

export default function Home(props) {
  let BList = props.FileList.entries;
  return (
    <div className="container">
      <Head>
        <title>Box Reactive App</title>
        <link rel="icon" href="/favicon.ico"/>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet"  crossOrigin="anonymous"/>
      </Head>

      <main>
        <h1 className="title">
          Welcome to <a href="https://box.com">Box!</a>
        </h1>

        <p className="description">
          And welcome <code>{user.name}</code> here are your files
        </p>
        <br/>

        <FileList fileList={BList}/>

        <div className="grid">
          <a href="https://nextjs.org/docs" className="card">
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <div href="https://nextjs.org/docs" className="card">
            <h3>Visit &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </div>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className="card">
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className="card"
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer>
      Powered by{' '}
      <Link href="/file">
        <a> Me!</a>
      </Link>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
