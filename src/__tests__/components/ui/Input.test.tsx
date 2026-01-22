import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@/test/test-utils'
import { Input } from '@/components/ui/input'

describe('Input Component', () => {
  it('应该正确渲染Input组件', () => {
    render(<Input placeholder="请输入内容" />)
    
    const input = screen.getByPlaceholderText('请输入内容')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
    expect(input).toHaveClass('flex', 'h-10', 'w-full', 'rounded-md', 'border', 'border-input', 'bg-background', 'px-3', 'py-2', 'text-sm', 'ring-offset-background', 'file:border-0', 'file:bg-transparent', 'file:text-sm', 'file:font-medium', 'placeholder:text-muted-foreground', 'focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-ring', 'focus-visible:ring-offset-2', 'disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('应该处理输入事件', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test input' } })
    
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(input).toHaveValue('test input')
  })

  it('应该支持不同的type属性', () => {
    render(<Input type="password" placeholder="请输入密码" />)
    
    const input = screen.getByPlaceholderText('请输入密码')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('应该在禁用状态下不响应输入', () => {
    const handleChange = vi.fn()
    render(<Input disabled onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })
    
    expect(handleChange).not.toHaveBeenCalled()
    expect(input).toBeDisabled()
  })

  it('应该应用自定义className', () => {
    render(<Input className="custom-input" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-input')
  })

  it('应该支持value属性', () => {
    render(<Input value="预设值" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('预设值')
  })

  it('应该支持defaultValue属性', () => {
    render(<Input defaultValue="默认值" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('默认值')
  })

  it('应该支持required属性', () => {
    render(<Input required />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeRequired()
  })

  it('应该支持readOnly属性', () => {
    render(<Input readOnly value="只读内容" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('readonly')
  })

  it('应该支持maxLength属性', () => {
    render(<Input maxLength={10} />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('maxlength', '10')
  })

  it('应该支持placeholder属性', () => {
    render(<Input placeholder="搜索订单号或合作伙伴" />)
    
    const input = screen.getByPlaceholderText('搜索订单号或合作伙伴')
    expect(input).toBeInTheDocument()
  })

  it('应该处理焦点事件', () => {
    const handleFocus = vi.fn()
    const handleBlur = vi.fn()
    
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />)
    
    const input = screen.getByRole('textbox')
    
    fireEvent.focus(input)
    expect(handleFocus).toHaveBeenCalledTimes(1)
    
    fireEvent.blur(input)
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('应该支持ref属性', () => {
    let inputRef: HTMLInputElement | null = null
    
    render(<Input ref={node => { inputRef = node }} />)
    
    const input = screen.getByRole('textbox')
    expect(inputRef).toBe(input)
  })
})