export default function SettingsHeading({ heading, description }: { heading: string; description?: string }) {
  return (
    <div>
      <h3 className='text-lg font-medium'>{heading}</h3>
      <p className='text-sm text-muted-foreground'>{description}</p>
    </div>
  )
}
