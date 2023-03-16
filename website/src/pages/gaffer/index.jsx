/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import Layout from '@theme/Layout'
import Features from '@site/src/components/Features'

import heroStyles from '@site/src/css/hero.module.css'

const FeatureList = [
  {
    title: 'Modularise your projects',
    description: (
      <>
        Don't repeat yourself. Build more robust games and projects with a
        self-contained monorepo at whatever scale you want.
      </>
    )
  },
  {
    title: 'Write simpler trees',
    description: (
      <>
        Remove redundancy and keep your Rojo trees clean and concise with
        syntactic sugar. Save writing $path 500 times.
      </>
    )
  },
  {
    title: 'Opinionated but flexible',
    description: (
      <>
        Gaffer doesn't care you structure your projects; it makes a few
        assumptions and then leaves the rest to you.
      </>
    )
  }
]

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', heroStyles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">Gaffer</h1>
        <p className="hero__subtitle">
          A monorepo orchestrator for Roblox developers
        </p>
        <div className={heroStyles.buttons}>
          <Link
            className="button button--success button--lg"
            to="/gaffer/docs/0.0/tutorial/getting-started">
            Get Started
          </Link>

          <Link
            className="button button--secondary button--lg"
            to="https://github.com/autonordev/tools/tree/main/gaffer">
            View on GitHub
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function GafferHome() {
  return (
    <Layout title="Gaffer">
      <HomepageHeader />
      <main>
        <Features List={FeatureList} />
      </main>
    </Layout>
  )
}
