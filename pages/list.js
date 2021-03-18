import Link from 'next/link'
import styles from "../lib/styles.module.css";
import { boxGetFolder } from '../lib/boxes.js';

function FileItem(props) {
  let items = props.file;
  let ndate = new Date(parseInt(items.name)*1000);
  return (
     <div className={styles.collser}>
      <img src={items.download_url} alt={items.name} className={styles.imgs} alt={items.name} id={items.id}/>
      <h5 className={styles.name}>{ndate != "Invalid Date" ? ndate.toLocaleString("nl-nl") : items.name}</h5>
      <Link href={"/file/" + items.id}>
        <a className={styles.btn}>View the Image</a>
      </Link>
     </div>
  );
}

export async function getServerSideProps({ query }) {
  let theFileList = await boxGetFolder(132260108317);
  for (let i = theFileList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (theFileList.length));
    [theFileList[i], theFileList[j]] = [theFileList[j], theFileList[i]];
  }
  theFileList = theFileList.length ? theFileList.slice(30) : theFileList;
  return {
    props: { Home: theFileList },
  };
};

const FileList = (props) => {
    return (
      <div className={styles.row}>
        {props.fileList.map((file) =>
          <FileItem key={file.id.toString()} file={file} />
        )}
      </div>
    );
}
export default function Home(props) {
  let tafileList = props.Home.entries;
  return <FileList fileList={tafileList}/>;
}
