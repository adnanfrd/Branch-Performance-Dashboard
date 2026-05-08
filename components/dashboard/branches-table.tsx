import { Branch } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type BranchesTableProps = {
  branches: Branch[]
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function getPerformanceColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25'
  if (score >= 60) return 'bg-amber-500/15 text-amber-300 border-amber-500/25'
  return 'bg-red-500/15 text-red-300 border-red-500/25'
}

function getPerformanceLabel(score: number): string {
  if (score >= 80) return 'Strong'
  if (score >= 60) return 'Monitor'
  return 'Needs Improvement'
}

function clampScore(score: number) {
  return Math.min(Math.max(score, 0), 100)
}

export function BranchesTable({ branches }: BranchesTableProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Branch Performance Overview</CardTitle>
        </div>
        <Badge
          variant="outline"
          className={branches.length === 5 ? 'border-emerald-500/30 text-emerald-300' : 'border-destructive/40 text-destructive'}
        >
          {branches.length} of 5 branches
        </Badge>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="px-4 py-3 text-sm font-semibold">
                Branch Name
              </TableHead>
              <TableHead className="px-4 py-3 text-right text-sm font-semibold">
                Monthly Revenue ($)
              </TableHead>
              <TableHead className="px-4 py-3 text-right text-sm font-semibold">
                Open Member Inquiries
              </TableHead>
              <TableHead className="px-4 py-3 text-right text-sm font-semibold">
                Staff Count
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-sm font-semibold">
                Performance Score
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((branch) => {
              const score = clampScore(branch.performance_score)

              return (
                <TableRow key={branch.id} className="border-border/50 hover:bg-secondary/30">
                  <TableCell className="px-4 py-3 text-sm font-medium text-foreground">
                    {branch.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-right text-chart-1 font-semibold tabular-nums">
                    {currencyFormatter.format(branch.monthly_revenue)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-right text-chart-2 font-semibold tabular-nums">
                    {branch.open_inquiries}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-right text-foreground tabular-nums">
                    {branch.staff_count}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Progress
                        value={score}
                        className="[&>div]:bg-current h-2 w-24 text-emerald-500 data-[score=monitor]:text-amber-500 data-[score=needs-improvement]:text-red-500"
                        data-score={score >= 80 ? 'strong' : score >= 60 ? 'monitor' : 'needs-improvement'}
                      />
                      <span
                        className={`min-w-36 rounded-md border px-2 py-1 text-center text-xs font-bold tabular-nums whitespace-nowrap ${getPerformanceColor(score)}`}
                      >
                        {score}% {getPerformanceLabel(score)}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
