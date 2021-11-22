import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'

const Welcome = ({name}) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{name}</title>
        <meta name="description" content="by chasi framework" />
      </Head>

      <main className={styles.main}>
        <div className={styles.card}>
          <p className={styles.title} >
            <strong> Welcome {name}! </strong>
          </p>
          <p className={styles.description}>
            Greetings from chasi
          </p>
        </div>
      </main>
    </div>
  )
}

Welcome.getInitialProps = async (context) => {
  const { name } = context.query
  return { name }
}
export default Welcome;
