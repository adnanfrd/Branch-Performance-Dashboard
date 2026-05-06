import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Branch } from '@/lib/supabase'

type SummaryCardsProps = {
  branches: Branch[]
}

export function SummaryCards({ branches }: SummaryCardsProps) {
  const totalRevenue = branches.reduce((sum, branch) => sum + branch.monthly_revenue, 0)
  const totalInquiries = branches.reduce((sum, branch) => sum + branch.open_inquiries, 0)
  const totalStaff = branches.reduce((sum, branch) => sum + branch.staff_count, 0)
  const avgPerformance = branches.length > 0
    ? Math.round(branches.reduce((sum, branch) => sum + branch.performance_score, 0) / branches.length)
    : 0

  const cards = [
    {
      title: 'Total Revenue',
      value: `$${(totalRevenue / 1000).toFixed(1)}K`,
      description: 'Monthly revenue across all branches',
      color: 'text-chart-1',
    },
    {
      title: 'Open Inquiries',
      value: totalInquiries.toString(),
      description: 'Total member inquiries',
      color: 'text-chart-2',
    },
    {
      title: 'Staff Count',
      value: totalStaff.toString(),
      description: 'Total employees',
      color: 'text-chart-4',
    },
    {
      title: 'Avg Performance',
      value: `${avgPerformance}%`,
      description: 'Average performance score',
      color: 'text-chart-5',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <Card key={card.title} className="bg-card border-border overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color} mb-1`}>
              {card.value}
            </div>
            <p className="text-xs text-muted-foreground">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
