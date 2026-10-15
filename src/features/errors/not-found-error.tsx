import { Link, useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { errors } from '@/content'
import { Button } from '@/components/ui/button'
import { ErrorShell } from './error-shell'

export function NotFoundError() {
  const { history } = useRouter()
  const copy = errors.notFound
  return (
    <ErrorShell code={copy.code} title={copy.title} body={copy.body}>
      <Button variant='outline' onClick={() => history.go(-1)}>
        <ArrowLeft />
        {copy.back}
      </Button>
      <Button asChild>
        <Link to='/'>{copy.home}</Link>
      </Button>
    </ErrorShell>
  )
}
