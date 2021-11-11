import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Chasi!</title>
        <meta name="description" content="by chasi framework" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.borderBox}>
          <h1 className={styles.title} >
            <a> Chasi! </a>
          </h1>

          <p className={styles.description}>
            build it with modules!
          </p>
        </div>
      </main>

    
    </div>
  )
}
