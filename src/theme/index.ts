import palettes from './palettes'

import { loadTheme } from '@fluentui/react'
import { IPalette } from '@uifabric/styling/lib/interfaces/IPalette'

const prefersDark =
  typeof window !== 'undefined' && window['matchMedia']
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false

loadTheme({
  palette: prefersDark ? palettes.dark : palettes.light,
})

export type Theme = {
  light: Partial<IPalette>
  dark: Partial<IPalette>
}

export default {
  light: palettes.light,
  dark: palettes.dark,
}
