import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@/test/test-utils'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('应该正确渲染按钮文本', () => {
    render(<Button>Click me</Button>)
    
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('应该处理点击事件', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('应该在禁用状态下不触发点击事件', () => {
    const handleClick = vi.fn()
    render(
      <Button onClick={handleClick} disabled>
        Disabled Button
      </Button>
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
    expect(button).toBeDisabled()
  })

  it('应该正确应用variant样式', () => {
    render(<Button variant="outline">Outline Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border')
  })

  it('应该正确应用size样式', () => {
    render(<Button size="sm">Small Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-9')
  })
})