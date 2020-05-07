import React from 'react'
import { RendererProvider, ThemeProvider, useFela } from 'react-fela'
import { createRenderer, IStyle } from 'fela'
import theme from './theme'
import t from './t10s/en'
import Stopwatch from './components/Stopwatch'

const felaRenderer = createRenderer()

const outer = (): IStyle => ({
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'center',
  minHeight: '100vh',
  maxWidth: '800px',
  margin: '0 auto',
})

const inner = (): IStyle => ({
  boxSizing: 'border-box',
  padding: '4rem',
  width: '100%',
})

function Main() {
  const { css } = useFela({})
  return (
    <main className={css(outer)} role="application">
      <div className={css(inner)}>
        <Stopwatch t={t} />
      </div>
    </main>
  )
}

function App() {
  return (
    <RendererProvider renderer={felaRenderer}>
      <ThemeProvider theme={theme}>
        <Main />
      </ThemeProvider>
    </RendererProvider>
  )
}

export default App
