import { yupResolver } from '@hookform/resolvers/yup'
import { ChevronDownIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button, buttonVariants } from 'src/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { RadioGroup, RadioGroupItem } from 'src/components/ui/radio-group'
import { Separator } from 'src/components/ui/separator'
import SettingsHeading from 'src/pages/DashBoard/pages/Settings/components/SettingsHeading'
import { cn } from 'src/utils/utils'
import * as yup from 'yup'

const appearanceFormSchema = yup.object().shape({
  theme: yup.string().oneOf(['light', 'dark']).required('Vui lòng chọn một theme.'),
  font: yup.string().oneOf(['inter', 'manrope', 'system']).required('Vui lòng chọn một phông chữ.')
})
type AppearanceSchema = yup.InferType<typeof appearanceFormSchema>

const defaultValues: Partial<AppearanceSchema> = {
  theme: 'light'
}

export default function SettingsAppearance() {
  const form = useForm<AppearanceSchema>({
    resolver: yupResolver(appearanceFormSchema),
    defaultValues
  })

  function onSubmit(data: AppearanceSchema) {
    console.log(data)
  }

  return (
    <div className='space-y-6'>
      <SettingsHeading
        heading='Hiển thị'
        description='Tùy chỉnh giao diện của ứng dụng. Tự động chuyển đổi giữa các theme ngày và đêm.'
      />
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='font'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Font</FormLabel>
                <div className='relative w-max'>
                  <FormControl>
                    <select
                      className={cn(buttonVariants({ variant: 'outline' }), 'w-[200px] appearance-none font-normal')}
                      {...field}
                    >
                      <option value='inter'>Inter</option>
                      <option value='manrope'>Manrope</option>
                      <option value='system'>System</option>
                    </select>
                  </FormControl>
                  <ChevronDownIcon className='absolute right-3 top-2.5 h-4 w-4 opacity-50' />
                </div>
                <FormDescription>Đặt phông chữ bạn muốn sử dụng trong trang quản trị.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='theme'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel>Theme</FormLabel>
                <FormDescription>Chọn theme cho trang quản trị.</FormDescription>
                <FormMessage />
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className='grid max-w-md grid-cols-2 gap-8 pt-2'
                >
                  <FormItem>
                    <FormLabel className='[&:has([data-state=checked])>div]:border-primary'>
                      <FormControl>
                        <RadioGroupItem value='light' className='sr-only' />
                      </FormControl>
                      <div className='items-center rounded-md border-2 border-muted p-1 hover:border-accent'>
                        <div className='space-y-2 rounded-sm bg-[#ecedef] p-2'>
                          <div className='space-y-2 rounded-md bg-white p-2 shadow-sm'>
                            <div className='h-2 w-[80px] rounded-lg bg-[#ecedef]' />
                            <div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
                          </div>
                          <div className='flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm'>
                            <div className='h-4 w-4 rounded-full bg-[#ecedef]' />
                            <div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
                          </div>
                          <div className='flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm'>
                            <div className='h-4 w-4 rounded-full bg-[#ecedef]' />
                            <div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
                          </div>
                        </div>
                      </div>
                      <span className='block w-full p-2 text-center font-normal'>Light</span>
                    </FormLabel>
                  </FormItem>
                  <FormItem>
                    <FormLabel className='[&:has([data-state=checked])>div]:border-primary'>
                      <FormControl>
                        <RadioGroupItem value='dark' className='sr-only' />
                      </FormControl>
                      <div className='items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground'>
                        <div className='space-y-2 rounded-sm bg-slate-950 p-2'>
                          <div className='space-y-2 rounded-md bg-slate-800 p-2 shadow-sm'>
                            <div className='h-2 w-[80px] rounded-lg bg-slate-400' />
                            <div className='h-2 w-[100px] rounded-lg bg-slate-400' />
                          </div>
                          <div className='flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm'>
                            <div className='h-4 w-4 rounded-full bg-slate-400' />
                            <div className='h-2 w-[100px] rounded-lg bg-slate-400' />
                          </div>
                          <div className='flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm'>
                            <div className='h-4 w-4 rounded-full bg-slate-400' />
                            <div className='h-2 w-[100px] rounded-lg bg-slate-400' />
                          </div>
                        </div>
                      </div>
                      <span className='block w-full p-2 text-center font-normal'>Dark</span>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormItem>
            )}
          />

          <Button type='submit'>Lưu lại</Button>
        </form>
      </Form>
    </div>
  )
}
