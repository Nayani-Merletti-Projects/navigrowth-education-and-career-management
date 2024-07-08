import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Navigrowth</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Mukta:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/Styles/general.css" />
        <link rel="stylesheet" href="/Styles/NavBar.css" />
        <link rel="stylesheet" href="/Styles/Home_Page.css" />
      </Head>
      <body>
        <header className="Homepage-header">
          <div className="menu">
            <button className="menu-icon-button js-menu-button">
              <Image
                className="menu-icon"
                src="/Icons/menu-icon.png"
                alt="Menu"
                width={50}
                height={50}
              />
            </button>
          </div>

          <div className="Website-Title">
            <span className="title-text">NaviGrowth Education</span>
          </div>

          <div className="info-section">
            <Link href="/AboutUs" passHref>
              <a className="info-links" target="_blank">
                About Us
              </a>
            </Link>
          </div>

          <div className="info-section">
            <Link href="/Settings" passHref>
              <a className="info-links" target="_blank">
                Settings
              </a>
            </Link>
          </div>
        </header>

        <main className="body-text">
          <p className="home-msg">Hey There Luke!</p>
          <span className="homepage-goal-header">GOALS</span>
          <div className="homepage-goal-tracker">
            <p className="no-goals-msg">You are all done!</p>
            <Link href="/Goals" passHref>
              <a className="no-goals-link">Make some new ones!</a>
            </Link>
          </div>
        </main>

        <div className="js-navbar"></div>

        <script async src="/Components/NavBar.js"></script>
      </body>
    </>
  );
}
