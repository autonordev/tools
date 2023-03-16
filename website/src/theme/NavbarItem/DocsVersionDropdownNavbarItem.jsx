import React from 'react'
import useRouteContext from '@docusaurus/useRouteContext'
import DocsVersionDropdownNavbarItem from '@theme-original/NavbarItem/DocsVersionDropdownNavbarItem'

export default function DocsVersionDropdownNavbarItemWrapper(props) {
  // do not display this navbar item if current page is not a doc
  const { plugin } = useRouteContext()
  if (plugin.id !== 'gaffer') {
    return null
  }

  return <DocsVersionDropdownNavbarItem docsPluginId={plugin.id} {...props} />
}
