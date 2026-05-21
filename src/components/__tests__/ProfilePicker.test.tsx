import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ProfilePicker from '../ProfilePicker'
import type { ChildProfile } from '@/lib/childProfile'

const EMMA: ChildProfile = { name: 'Emma', ageGroup: '4-6', buddyId: 'rexy' }
const LEO: ChildProfile  = { name: 'Leo',  ageGroup: '8-12', buddyId: 'spark' }

describe('ProfilePicker — display', () => {
  it('shows the child name', () => {
    const { container } = render(<ProfilePicker profile={EMMA} onSwitch={() => {}} />)
    expect(container.textContent).toContain('Emma')
  })

  it('shows the age group label', () => {
    render(<ProfilePicker profile={EMMA} onSwitch={() => {}} />)
    expect(screen.getByText(/4.?6/)).toBeInTheDocument()
  })

  it('shows buddy emoji', () => {
    render(<ProfilePicker profile={EMMA} onSwitch={() => {}} />)
    expect(screen.getByText('🦕')).toBeInTheDocument()  // rexy
  })

  it('shows spark emoji for Leo', () => {
    render(<ProfilePicker profile={LEO} onSwitch={() => {}} />)
    expect(screen.getByText('⚡')).toBeInTheDocument()  // spark
  })

  it('has a switch/change affordance', () => {
    render(<ProfilePicker profile={EMMA} onSwitch={() => {}} />)
    expect(screen.getByRole('button', { name: /switch|change|not.*emma/i }))
      .toBeInTheDocument()
  })
})

describe('ProfilePicker — interaction', () => {
  it('calls onSwitch when the switch button is tapped', () => {
    const onSwitch = vi.fn()
    render(<ProfilePicker profile={EMMA} onSwitch={onSwitch} />)
    fireEvent.click(screen.getByRole('button', { name: /switch|change|not.*emma/i }))
    expect(onSwitch).toHaveBeenCalledOnce()
  })
})
