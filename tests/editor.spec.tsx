import React from 'react'
import { render, screen } from '@testing-library/react'
import EditorPage from '../src/routes/EditorPage'

describe('Editor smoke', () => {
  it('renders editor and inspector', async () => {
    render(<EditorPage />)
    expect(screen.getByText(/Editor/)).toBeDefined()
    // Inspector hint
    expect(screen.getByText(/Select a single tag to edit/)).toBeDefined()
  })
})

