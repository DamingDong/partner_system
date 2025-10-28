import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { CardStatus } from '@/types'

describe('Card Components', () => {
  describe('Card', () => {
    it('应该正确渲染Card组件', () => {
      render(<Card>Card Content</Card>)
      
      const card = screen.getByText('Card Content')
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('rounded-lg', 'border', 'bg-card')
    })

    it('应该应用自定义className', () => {
      render(<Card className="custom-class">Card Content</Card>)
      
      const card = screen.getByText('Card Content')
      expect(card).toHaveClass('custom-class')
    })
  })

  describe('CardHeader', () => {
    it('应该正确渲染CardHeader', () => {
      render(
        <Card>
          <CardHeader>Header Content</CardHeader>
        </Card>
      )
      
      const header = screen.getByText('Header Content')
      expect(header).toBeInTheDocument()
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
    })
  })

  describe('CardTitle', () => {
    it('应该正确渲染CardTitle', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
        </Card>
      )
      
      const title = screen.getByText('Card Title')
      expect(title).toBeInTheDocument()
      expect(title.tagName).toBe('H3')
      expect(title).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight')
    })
  })

  describe('CardDescription', () => {
    it('应该正确渲染CardDescription', () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
        </Card>
      )
      
      const description = screen.getByText('Card Description')
      expect(description).toBeInTheDocument()
      expect(description.tagName).toBe('P')
      expect(description).toHaveClass('text-sm', 'text-muted-foreground')
    })
  })

  describe('CardContent', () => {
    it('应该正确渲染CardContent', () => {
      render(
        <Card>
          <CardContent>Content Area</CardContent>
        </Card>
      )
      
      const content = screen.getByText('Content Area')
      expect(content).toBeInTheDocument()
      expect(content).toHaveClass('p-6', 'pt-0')
    })
  })

  describe('CardFooter', () => {
    it('应该正确渲染CardFooter', () => {
      render(
        <Card>
          <CardFooter>Footer Content</CardFooter>
        </Card>
      )
      
      const footer = screen.getByText('Footer Content')
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0')
    })
  })

  describe('完整Card示例', () => {
    it('应该正确渲染完整的Card结构', () => {
      render(
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>创建项目</CardTitle>
            <CardDescription>
              在您的组织中部署一个新项目。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>项目内容区域</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <button>取消</button>
            <button>部署</button>
          </CardFooter>
        </Card>
      )
      
      expect(screen.getByText('创建项目')).toBeInTheDocument()
      expect(screen.getByText('在您的组织中部署一个新项目。')).toBeInTheDocument()
      expect(screen.getByText('项目内容区域')).toBeInTheDocument()
      expect(screen.getByText('取消')).toBeInTheDocument()
      expect(screen.getByText('部署')).toBeInTheDocument()
    })
  })

  describe('Card状态显示', () => {
    it('应该正确显示PENDING_BIND状态', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>会员卡状态</CardTitle>
          </CardHeader>
          <CardContent>
            <p>状态: {CardStatus.PENDING_BIND}</p>
          </CardContent>
        </Card>
      )
      
      expect(screen.getByText(`状态: ${CardStatus.PENDING_BIND}`)).toBeInTheDocument()
    })

    it('应该正确显示BOUND状态', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>会员卡状态</CardTitle>
          </CardHeader>
          <CardContent>
            <p>状态: {CardStatus.BOUND}</p>
          </CardContent>
        </Card>
      )
      
      expect(screen.getByText(`状态: ${CardStatus.BOUND}`)).toBeInTheDocument()
    })
  })
})