import React from 'react'
import { render } from '@testing-library/react'
import { getByRole } from '@testing-library/dom'
import App from './App'

test('renders basic wrappers', () => {
  const { container } = render(<App />)
  const mainElement = getByRole(container, 'application')
  expect(mainElement).toBeInTheDocument()
})
