import Head from 'next/head'
import Link from 'next/link'

export default function FirstFile() {
  //TODO: make a search tool
  return (
    <>
      <Head>
        <title>No File Found</title>
      </Head>
      <h1>First File</h1>
      <h2>
        <Link href="/box">
          <a>Back to home</a>
        </Link>
      </h2>
    </>
  )
}
