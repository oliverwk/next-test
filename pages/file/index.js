import Head from 'next/head'
import Link from 'next/link'
import bars from '../../lib/bar.module.css'
import { btn } from '../../lib/styles.module.css'
 
const margin = "2";

function Bar() {
  let handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log("New url", `/file/${ e.target.value }`);
      window.location = `/file/${e.target.value}`;
    }
  }
  return (
    <input onKeyDown={handleKeyDown} style={{ position: "relative", margin: margin + "rem" }} type="text" autofocus spellcheck="false" title="Put you'r id here" autocapitalize="off" className={bars.bar}></input>
  );
}
export default function FirstFile() {
  return (
    <div className={ bars.body }>
      <Head>
        <title>Search Files</title>
      </Head>
      <h1 className={bars.header}>Search Files</h1>
      <br/>
        <Bar/>
      <br />
        <Link href="/box">
        <a className={btn} style={{ position: "relative", margin: margin + "rem" }} >Back to home</a>
        </Link>
    </div>
  )
}
