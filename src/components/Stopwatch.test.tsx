import React from 'react'
import { render } from '@testing-library/react'
import { getByRole } from '@testing-library/dom'
import { RendererProvider, ThemeProvider } from 'react-fela'
import theme from '../theme'
import { createRenderer } from 'fela'

import Stopwatch from './Stopwatch'
import t from '../t10s/en'

const felaRenderer = createRenderer()

test('renders basic wrappers', () => {
  const { container } = render(
    <RendererProvider renderer={felaRenderer}>
      <ThemeProvider theme={theme}>
        <Stopwatch t={t} />
      </ThemeProvider>
    </RendererProvider>
  )
  const timerElement = getByRole(container, 'timer')
  expect(timerElement).toBeInTheDocument()
})
