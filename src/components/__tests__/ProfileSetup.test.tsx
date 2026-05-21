import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ProfileSetup from '../ProfileSetup'

beforeEach(() => { localStorage.clear() })

describe('ProfileSetup — structure', () => {
  it('renders a name input', () => {
    render(<ProfileSetup onComplete={() => {}} />)
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument()
  })

  it('renders age group options', () => {
    render(<ProfileSetup onComplete={() => {}} />)
    // 4 age groups should be tappable
    expect(screen.getByText(/2.?4/)).toBeInTheDocument()
    expect(screen.getByText(/4.?6/)).toBeInTheDocument()
    expect(screen.getByText(/6.?8/)).toBeInTheDocument()
    expect(screen.getByText(/8.?12/)).toBeInTheDocument()
  })

  it('renders buddy selection options', () => {
    render(<ProfileSetup onComplete={() => {}} />)
    // At least Rexy should be there
    expect(screen.getByText(/rexy/i)).toBeInTheDocument()
  })

  it('shows a Create / Start button', () => {
    render(<ProfileSetup onComplete={() => {}} />)
    expect(screen.getByRole('button', { name: /create|start|let.?s go|play/i }))
      .toBeInTheDocument()
  })
})

describe('ProfileSetup — validation', () => {
  it('Create button is disabled when name is empty', () => {
    render(<ProfileSetup onComplete={() => {}} />)
    const btn = screen.getByRole('button', { name: /create|start|let.?s go|play/i })
    expect(btn).toBeDisabled()
  })

  it('Create button is disabled when no age is selected', () => {
    render(<ProfileSetup onComplete={() => {}} />)
    fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: 'Emma' } })
    const btn = screen.getByRole('button', { name: /create|start|let.?s go|play/i })
    expect(btn).toBeDisabled()
  })
})

describe('ProfileSetup — completion', () => {
  it('calls onComplete with profile data when form is submitted', () => {
    const onComplete = vi.fn()
    render(<ProfileSetup onComplete={onComplete} />)

    fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: 'Emma' } })
    fireEvent.click(screen.getByText(/4.?6/))  // select age
    fireEvent.click(screen.getByRole('button', { name: /create|start|let.?s go|play/i }))

    expect(onComplete).toHaveBeenCalledOnce()
    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Emma', ageGroup: '4-6' })
    )
  })

  it('saves profile to localStorage on submit', () => {
    render(<ProfileSetup onComplete={() => {}} />)
    fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: 'Leo' } })
    fireEvent.click(screen.getByText(/6.?8/))
    fireEvent.click(screen.getByRole('button', { name: /create|start|let.?s go|play/i }))

    const stored = JSON.parse(localStorage.getItem('sp_child_profile') ?? 'null')
    expect(stored?.name).toBe('Leo')
    expect(stored?.ageGroup).toBe('6-8')
  })
})
