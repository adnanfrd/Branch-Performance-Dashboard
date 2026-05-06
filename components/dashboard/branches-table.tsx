import { Branch } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type BranchesTableProps = {
  branches: Branch[]
}

function getPerformanceColor(score: number): string {
  if (score >= 71) return 'bg-green-500/20 text-green-400'
  if (score >= 41) return 'bg-yellow-500/20 text-yellow-400'
  return 'bg-red-500/20 text-red-400'
}

function getPerformanceLabel(score: number): string {
  if (score >= 71) return 'Strong'
  if (score >= 41) return 'Average'
  return 'Needs Improvement'
}

export function BranchesTable({ branches }: BranchesTableProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Branch Performance Overview</CardTitle>
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
                  Monthly Revenue
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                  Open Inquiries
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
                  <td className="px-4 py-3 text-sm text-right text-chart-1 font-semibold">
                    ${branch.monthly_revenue.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-chart-2 font-semibold">
                    {branch.open_inquiries}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-foreground">
                    {branch.staff_count}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex-1 bg-border rounded-full h-2 max-w-[100px]">
                        <div
                          className={`h-full rounded-full transition-all ${
                            branch.performance_score >= 71
                              ? 'bg-green-500'
                              : branch.performance_score >= 41
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${branch.performance_score}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap ${getPerformanceColor(branch.performance_score)}`}
                      >
                        {branch.performance_score}%
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
