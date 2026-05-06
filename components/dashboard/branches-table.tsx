import { Branch } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type BranchesTableProps = {
  branches: Branch[]
}

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

function getPerformanceBarColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 60) return 'bg-amber-500'
  return 'bg-red-500'
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
          <p className="mt-1 text-sm text-muted-foreground">
            Required metrics for each branch: revenue, inquiries, staff count, and score.
          </p>
        </div>
        <Badge
          variant="outline"
          className={branches.length === 5 ? 'border-emerald-500/30 text-emerald-300' : 'border-destructive/40 text-destructive'}
        >
          {branches.length} of 5 branches
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Branch Name
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                  Monthly Revenue ($)
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                  Open Member Inquiries
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                  Staff Count
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">
                  Performance Score
                </th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch) => (
                <tr key={branch.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {branch.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-chart-1 font-semibold tabular-nums">
                    ${branch.monthly_revenue.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-chart-2 font-semibold tabular-nums">
                    {branch.open_inquiries}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-foreground tabular-nums">
                    {branch.staff_count}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-border">
                        <div
                          className={`h-full rounded-full transition-all ${getPerformanceBarColor(branch.performance_score)}`}
                          style={{ width: `${clampScore(branch.performance_score)}%` }}
                        />
                      </div>
                      <span
                        className={`min-w-36 rounded-md border px-2 py-1 text-center text-xs font-bold tabular-nums whitespace-nowrap ${getPerformanceColor(branch.performance_score)}`}
                      >
                        {branch.performance_score}% {getPerformanceLabel(branch.performance_score)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
