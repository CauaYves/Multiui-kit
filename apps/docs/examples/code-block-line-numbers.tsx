"use client" // sync-shadcn

import { CodeBlock, CodeBlockContent } from "@multiclubes/ui/components/code-block"

const code = `{
  "name": "chat",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  }
}`

export function CodeBlockLineNumbers() {
  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockContent lineNumbers>{code}</CodeBlockContent>
      </CodeBlock>
    </div>
  )
}
