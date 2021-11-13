import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Chasi!</title>
        <meta name="description" content="by chasi framework" />
      </Head>

      <main className={styles.main}>
        <h1>
          about!
        </h1>
      </main>

    
    </div>
  )
}
