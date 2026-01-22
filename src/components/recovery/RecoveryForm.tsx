import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

const recoverySchema = z.object({
  redemptionRequestId: z.string().min(1, '请求ID不能为空'),
  days: z.number().min(1, '天数必须大于0'),
  description: z.string().min(1, '描述不能为空')
})

interface RecoveryFormProps {
  onSubmit: (values: z.infer<typeof recoverySchema>) => void
  onCancel?: () => void
  loading?: boolean
  defaultValues?: Partial<z.infer<typeof recoverySchema>>
}

export const RecoveryForm: React.FC<RecoveryFormProps> = ({
  onSubmit,
  loading = false,
  defaultValues
}) => {
  const form = useForm<z.infer<typeof recoverySchema>>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      redemptionRequestId: '',
      days: 0,
      description: '',
      ...defaultValues
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="redemptionRequestId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>回收请求ID</FormLabel>
              <FormControl>
                <Input placeholder="输入回收请求ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>回收天数</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="输入回收天数" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>描述</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="输入回收原因或描述" 
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? '处理中...' : '提交回收'}
        </Button>
      </form>
    </Form>
  )
}