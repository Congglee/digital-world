import { Editor } from '@tinymce/tinymce-react'

export default function RichTextEditor({
  value,
  onChange,
  editorHeight = 350
}: {
  value?: string
  onChange: (...event: any[]) => void
  editorHeight?: number
}) {
  return (
    <Editor
      apiKey={import.meta.env.VITE_TINY_MCE_API_KEY}
      init={{
        height: editorHeight,
        menubar: true,
        plugins:
          'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker',
        toolbar:
          'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
        content_style: 'body { font-family: "Inter", sans-serif; font-size: 14px }'
      }}
      initialValue={value || '<p></p>'}
      onEditorChange={(newValue) => onChange(newValue)}
      // onChange={(e) => onChange(e.target.getContent())}
    />
  )
}
