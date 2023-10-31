import Head from 'next/head'
import Link from 'next/link'
import bars from '../../lib/bar.module.css'
import { btn } from '../../lib/styles.module.css'
 
const margin = "2";

function Bar() {
  let handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.target.value.length != 12) {
        alert("It's need to be longer then 12 chars")
      } else {
        window.location = `/file/${e.target.value}`;
      } 
    }
  }
  return (
    <input onKeyDown={handleKeyDown} style={{ position: "relative", margin: margin + "rem" }} type="text" autoFocus spellCheck="false" title="Put you'r id here" autoCapitalize="off" className={bars.bar}></input>
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
        <Link href="/box" className={btn} style={{ position: "relative", margin: margin + "rem" }} >
		Back to home
        </Link>
    </div>
  )
}
