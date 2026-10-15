import { Link } from '@tanstack/react-router'
import { RotateCcw } from 'lucide-react'
import { errors } from '@/content'
import { Button } from '@/components/ui/button'
import { ErrorShell } from './error-shell'

export function GeneralError() {
  const copy = errors.general
  return (
    <ErrorShell code={copy.code} title={copy.title} body={copy.body}>
      <Button variant='outline' onClick={() => window.location.reload()}>
        <RotateCcw />
        {copy.retry}
      </Button>
      <Button asChild>
        <Link to='/'>{copy.home}</Link>
      </Button>
    </ErrorShell>
  )
}
