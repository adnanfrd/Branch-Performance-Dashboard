import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Branch } from '@/lib/supabase'
import { Building2, DollarSign, Gauge, MessageSquare, Users } from 'lucide-react'

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
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(totalRevenue),
      description: 'Monthly revenue across all branches',
      color: 'text-chart-1',
      icon: DollarSign,
    },
    {
      title: 'Open Inquiries',
      value: totalInquiries.toString(),
      description: 'Total member inquiries',
      color: 'text-chart-2',
      icon: MessageSquare,
    },
    {
      title: 'Staff Count',
      value: totalStaff.toString(),
      description: 'Total employees',
      color: 'text-chart-4',
      icon: Users,
    },
    {
      title: 'Avg Performance',
      value: `${avgPerformance}%`,
      description: 'Average performance score',
      color: 'text-chart-5',
      icon: Gauge,
    },
    {
      title: 'Branches Displayed',
      value: `${branches.length}/5`,
      description: 'Expected branch records shown',
      color: branches.length === 5 ? 'text-chart-2' : 'text-destructive',
      icon: Building2,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6">
      {cards.map((card) => (
        <Card key={card.title} className="bg-card border-border overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color} mb-1 tabular-nums`}>
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
