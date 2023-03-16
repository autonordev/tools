/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import clsx from 'clsx'
// import Link from '@docusaurus/Link'
import Layout from '@theme/Layout'

import heroStyles from '@site/src/css/hero.module.css'

function HomepageHeader() {
  return (
    <header className={clsx('hero', heroStyles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">Axon</h1>
        <p className="hero__subtitle">
          Axon is currently an internal, work in progress tool and not available
          to the public.
        </p>
        {/* <div className={heroStyles.buttons}>
          <Link
            className="button button--success button--lg"
            to="/axon/docs/0.0/intro">
            Get Started
          </Link>

          <Link
            className="button button--secondary button--lg"
            to="https://github.com/autonordev/tools/tree/main/axon">
            View on GitHub
          </Link>
        </div> */}
      </div>
    </header>
  )
}

export default function GafferHome() {
  return (
    <Layout title="Axon">
      <HomepageHeader />
      <main></main>
    </Layout>
  )
}
