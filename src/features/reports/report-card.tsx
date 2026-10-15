import { useState } from 'react'
import { ChartColumnBig, Table2 } from 'lucide-react'
import { reports } from '@/content'
import { cn } from '@/lib/utils'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Segmented } from '@/components/segmented'

type View = 'chart' | 'table'

/** Report card with a Chart / Table switch (the table is the accessible twin of the chart). */
export function ReportCard({
  title,
  description,
  className,
  toggle = true,
  children,
}: {
  title: string
  description: string
  className?: string
  toggle?: boolean
  children: (view: View) => React.ReactNode
}) {
  const [view, setView] = useState<View>('chart')
  return (
    <Card className={cn('gap-4', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {toggle && (
          <CardAction>
            <Segmented
              label={reports.view.label}
              value={view}
              onChange={setView}
              options={[
                { id: 'chart', label: <><ChartColumnBig className='size-3.5' /><span className='max-sm:sr-only'>{reports.view.chart}</span></> },
                { id: 'table', label: <><Table2 className='size-3.5' /><span className='max-sm:sr-only'>{reports.view.table}</span></> },
              ]}
            />
          </CardAction>
        )}
      </CardHeader>
      <CardContent>{children(view)}</CardContent>
    </Card>
  )
}
