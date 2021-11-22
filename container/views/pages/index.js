import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { faGithubAlt, faReddit } from '@fortawesome/free-brands-svg-icons'
import { faAt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Script from 'next/script'
import { useRouter } from 'next/router'

const Home = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Chasi!</title>
        <meta name="description" content="by chasi framework" />
      </Head>

      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title} >
            Chasi!
          </h1>
          <p className={styles.description}>
            build it with modules.
          </p>
          <span className={styles.iconContainer}>
            <a target="_new" href="https://github.com/rocketbean/chasi" className={styles.button} >
              <FontAwesomeIcon icon={faGithubAlt} className={styles['ink-icon']}/>
            </a>
            <a target="_new" href="https://www.reddit.com/r/Chasi/" >
              <FontAwesomeIcon icon={faReddit} className={styles['ink-icon']}/>
            </a>
            <a target="_new" href="https://castmonkeys.com" >
              <FontAwesomeIcon icon={faAt} className={styles['ink-icon']}/>
            </a>
          </span>
        </div>
      </main>
      <script
            dangerouslySetInnerHTML={{
              __html: `
                console.log('%c Chasi!', 'font-family: "Roboto", padding:20px; font-weight: bold; font-size: 80px;color: white; text-shadow: 3px 3px 0 rgb(98,98,98) ');
                  `,
            }}
      ></script>
    </div>
  )
}
export default Home;
