import styles from "../lib/styles.module.css";
import { boxGetFolder } from '../lib/boxes.js';

let id = 132260108317;
function FileItem(props) {
  let items = props.file;
  let ndate = new Date(parseInt(items.name)*1000);
  return (
     <div className={styles.collser}>
      <img src={items.download_url} alt={items.name} className={styles.imgs}/>
      <h5 className={styles.header}>{ndate != "Invalid Date" ? ndate.toLocaleString("nl-nl") : items.name}</h5>
      <a href={"https://app.box.com/file/"+items.id} className={styles.btn}>View the Image</a>
     </div>
  );
}
//export async function getStaticProps() {
export async function getServerSideProps({ query }) {
  let theFileList = await boxGetFolder(id);
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
