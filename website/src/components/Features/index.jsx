import React from 'react'
import clsx from 'clsx'

import styles from './styles.module.css'

function Feature({ title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function Features({ List }) {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {List.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
