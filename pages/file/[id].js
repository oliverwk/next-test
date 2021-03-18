import Head from 'next/head';
import Link from 'next/link';
import styles from '../../lib/modal.module.css'
import { useRouter } from 'next/router';
import { boxGetFile } from '../../lib/boxes.js';

export default function file({ file }) {

    const router = useRouter()
    const { id } = router.query
    let ndate = new Date(parseInt(file.name) * 1000);
    return (
        <>
        <Head>
            <title>{file.id}</title>
        </Head>
            <main className={styles.main}>
                <img title={file.id} className={styles.img} src={file.download_url} width="500px" id={file.id}/>
                <div>
                    <h1 className={styles.title}>
                        { ndate != "Invalid Date" ? ndate.toLocaleString("nl-nl") : file.name }
                    </h1>
                    <h1 className={styles.detail}>
                        {file.name}
                    </h1>
                    <Link href="/box">
                        <a className={styles.button}>Back</a>
                    </Link>
                </div>
            </main>
        </>
    )
} 

export async function getServerSideProps({ params }) {
    let data = await boxGetFile(params.id);
    return {
        props: { file: data },
    }
}