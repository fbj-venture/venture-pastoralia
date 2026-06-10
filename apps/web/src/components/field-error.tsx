import type { StandardSchemaV1Issue } from '@tanstack/preact-form'

export const MakeError = (messages: string) : StandardSchemaV1Issue[] => {
  return [{ message: messages, path: [] }]
}

type Props = {
  errors: (StandardSchemaV1Issue | undefined)[]
}

export const FieldError = ({errors}: Props) => {
  const issue = errors.find((error) => error !== undefined)
  if (!issue)
    return null

  return <p class="auth__error">{ issue.message }</p>
}