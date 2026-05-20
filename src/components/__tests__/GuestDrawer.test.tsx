import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GuestDrawer from '../GuestDrawer'

describe('GuestDrawer', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <GuestDrawer open={false} variant="rewards" onClose={() => {}} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders when open', () => {
    render(<GuestDrawer open variant="rewards" onClose={() => {}} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('shows rewards content for rewards variant', () => {
    const { container } = render(<GuestDrawer open variant="rewards" onClose={() => {}} />)
    expect(container.textContent).toMatch(/badge|reward|earn|unlock/i)
  })

  it('shows profile content for profile variant', () => {
    const { container } = render(<GuestDrawer open variant="profile" onClose={() => {}} />)
    expect(container.textContent).toMatch(/profile|name|child|save/i)
  })

  it('calls onClose when close button is tapped', () => {
    const onClose = vi.fn()
    render(<GuestDrawer open variant="rewards" onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('has a sign-up CTA link', () => {
    render(<GuestDrawer open variant="rewards" onClose={() => {}} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', expect.stringContaining('signup'))
  })

  it('renders for both variants without throwing', () => {
    expect(() => render(<GuestDrawer open variant="rewards" onClose={() => {}} />)).not.toThrow()
    expect(() => render(<GuestDrawer open variant="profile" onClose={() => {}} />)).not.toThrow()
  })
})
