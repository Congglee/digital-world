import { Separator } from 'src/components/ui/separator'
import SettingsHeading from '../../components/SettingsHeading/SettingsHeading'
import { MailSchema, mailSchema } from 'src/utils/rules'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSendNotifyMailMutation } from 'src/redux/apis/mail.api'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Textarea } from 'src/components/ui/textarea'
import { Button } from 'src/components/ui/button'
import { Loader } from 'lucide-react'

type FormData = Pick<MailSchema, 'email' | 'subject' | 'content'>
const sendMailSchema = mailSchema.pick(['email', 'subject', 'content'])

export default function SettingsSendMail() {
  const form = useForm<FormData>({
    resolver: yupResolver(sendMailSchema),
    defaultValues: { email: '', subject: '', content: '' }
  })
  const [sendNotifyMail, { data, isSuccess, isLoading }] = useSendNotifyMailMutation()

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await sendNotifyMail(data)
    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.data.message)
      form.reset()
    }
  }, [isSuccess])

  return (
    <div className='space-y-6'>
      <SettingsHeading heading='Gửi mail' />
      <Separator />
      <Form {...form}>
        <form onSubmit={onSubmit} className='space-y-6'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Người nhận</FormLabel>
                <FormControl>
                  <Input placeholder='Email người nhận...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='subject'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiêu đề</FormLabel>
                <FormControl>
                  <Input placeholder='Tiêu đề...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nội dung</FormLabel>
                <FormControl>
                  <Textarea placeholder='Nội dung mail...' className='h-80' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='px-10' disabled={isLoading}>
            {isLoading ? <Loader className='animate-spin w-4 h-4 mr-1' /> : null}
            Gửi
          </Button>
        </form>
      </Form>
    </div>
  )
}
