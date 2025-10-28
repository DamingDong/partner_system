import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from '@/components/ui/table'

describe('Table Components', () => {
  describe('Table', () => {
    it('应该正确渲染Table组件', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>表格内容</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()
      expect(table).toHaveClass('w-full', 'caption-bottom', 'text-sm')
    })

    it('应该应用自定义className', () => {
      render(
        <Table className="custom-table">
          <TableBody>
            <TableRow>
              <TableCell>内容</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const table = screen.getByRole('table')
      expect(table).toHaveClass('custom-table')
    })
  })

  describe('TableHeader', () => {
    it('应该正确渲染TableHeader', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>表头</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      )
      
      const header = screen.getByRole('rowgroup')
      expect(header).toBeInTheDocument()
      expect(header).toHaveClass('[&_tr]:border-b')
    })
  })

  describe('TableHead', () => {
    it('应该正确渲染TableHead', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>列标题</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      )
      
      const head = screen.getByRole('columnheader')
      expect(head).toBeInTheDocument()
      expect(head).toHaveClass('h-12', 'px-4', 'text-left', 'align-middle', 'font-medium', 'text-muted-foreground', '[&:has([role=checkbox])]:pr-0')
    })
  })

  describe('TableBody', () => {
    it('应该正确渲染TableBody', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>数据行</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const body = screen.getByRole('rowgroup')
      expect(body).toBeInTheDocument()
      expect(body).toHaveClass('[&_tr:last-child]:border-0')
    })
  })

  describe('TableRow', () => {
    it('应该正确渲染TableRow', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>单元格</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const row = screen.getByRole('row')
      expect(row).toBeInTheDocument()
      expect(row).toHaveClass('border-b', 'transition-colors', 'hover:bg-muted/50', 'data-[state=selected]:bg-muted')
    })
  })

  describe('TableCell', () => {
    it('应该正确渲染TableCell', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>单元格内容</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const cell = screen.getByRole('cell')
      expect(cell).toBeInTheDocument()
      expect(cell).toHaveClass('p-4', 'align-middle', '[&:has([role=checkbox])]:pr-0')
    })
  })

  describe('TableFooter', () => {
    it('应该正确渲染TableFooter', () => {
      render(
        <Table>
          <TableFooter>
            <TableRow>
              <TableCell>页脚内容</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )
      
      const footer = screen.getByRole('rowgroup')
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveClass('border-t', 'bg-muted/50', 'font-medium', '[&>tr]:last:border-b-0')
    })
  })

  describe('TableCaption', () => {
    it('应该正确渲染TableCaption', () => {
      render(
        <Table>
          <TableCaption>表格描述</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>内容</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const caption = screen.getByText('表格描述')
      expect(caption).toBeInTheDocument()
      expect(caption).toHaveClass('mt-4', 'text-sm', 'text-muted-foreground')
    })
  })

  describe('完整表格示例', () => {
    it('应该正确渲染完整的表格结构', () => {
      render(
        <Table>
          <TableCaption>订单列表</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>订单号</TableHead>
              <TableHead>合作伙伴</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>金额</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>ORD001</TableCell>
              <TableCell>合作伙伴A</TableCell>
              <TableCell>待处理</TableCell>
              <TableCell>¥1,000.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ORD002</TableCell>
              <TableCell>合作伙伴B</TableCell>
              <TableCell>已完成</TableCell>
              <TableCell>¥2,000.00</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>总计</TableCell>
              <TableCell>¥3,000.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )
      
      expect(screen.getByText('订单列表')).toBeInTheDocument()
      expect(screen.getByText('订单号')).toBeInTheDocument()
      expect(screen.getByText('合作伙伴')).toBeInTheDocument()
      expect(screen.getByText('状态')).toBeInTheDocument()
      expect(screen.getByText('金额')).toBeInTheDocument()
      
      expect(screen.getByText('ORD001')).toBeInTheDocument()
      expect(screen.getByText('合作伙伴A')).toBeInTheDocument()
      expect(screen.getByText('待处理')).toBeInTheDocument()
      expect(screen.getByText('¥1,000.00')).toBeInTheDocument()
      
      expect(screen.getByText('ORD002')).toBeInTheDocument()
      expect(screen.getByText('合作伙伴B')).toBeInTheDocument()
      expect(screen.getByText('已完成')).toBeInTheDocument()
      expect(screen.getByText('¥2,000.00')).toBeInTheDocument()
      
      expect(screen.getByText('总计')).toBeInTheDocument()
      expect(screen.getByText('¥3,000.00')).toBeInTheDocument()
    })
  })
})