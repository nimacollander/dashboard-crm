import { getRecentContacts } from "@/lib/contacts";
import { daysBetween, DEMO_TODAY } from "@/lib/demo-date";
import { DEAL_STAGES, isOpenDeal, sumDealValues } from "@/lib/deal-stages";
import { getDeals } from "@/lib/deals";
import { formatCompactCurrency } from "@/lib/format";
import {
  DAILY_CLOSED_REVENUE,
  KPI_HISTORY,
  MONTHLY_QUOTA,
  NEW_LEADS_THIS_WEEK,
} from "@/lib/mock-data";
import type {
  DealStage,
  DealWithContact,
  Kpi,
  PacePoint,
  RevenuePace,
  StagePipeline,
  UpcomingDeal,
} from "@/types";

function getRevenuePace(): RevenuePace {
  const [year, month, todayDay] = DEMO_TODAY.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const closed = DAILY_CLOSED_REVENUE.reduce((sum, value) => sum + value, 0);
  const runRate = closed / todayDay;

  let cumulative = 0;
  const points: PacePoint[] = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    if (day <= todayDay) cumulative += DAILY_CLOSED_REVENUE[i] ?? 0;
    return {
      day,
      date: new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10),
      closed: day <= todayDay ? cumulative : null,
      projected: day >= todayDay ? closed + runRate * (day - todayDay) : null,
      pace: (MONTHLY_QUOTA * day) / daysInMonth,
    };
  });

  return {
    monthLabel: new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(year, month - 1, 1))),
    daysInMonth,
    today: todayDay,
    closed,
    quota: MONTHLY_QUOTA,
    paceToDate: (MONTHLY_QUOTA * todayDay) / daysInMonth,
    projected: runRate * daysInMonth,
    points,
  };
}

function getKpis(deals: DealWithContact[]): Kpi[] {
  const won = deals.filter((deal) => deal.stage === "won");
  const lost = deals.filter((deal) => deal.stage === "lost");
  const closedCount = won.length + lost.length;
  const winRate = closedCount ? Math.round((won.length / closedCount) * 100) : 0;
  const activeDeals = deals.filter(isOpenDeal).length;
  const avgDealSize = won.length ? sumDealValues(won) / won.length : 0;

  // Each sparkline ends on the live value, so the trend and the number agree.
  const withCurrent = (history: number[], current: number) => [...history, current];
  const percentChange = (history: number[], current: number) => {
    const previous = history[history.length - 1];
    return previous ? ((current - previous) / previous) * 100 : 0;
  };

  const leadsChange = percentChange(KPI_HISTORY.newLeads, NEW_LEADS_THIS_WEEK);
  const winRateChange = winRate - KPI_HISTORY.winRate[KPI_HISTORY.winRate.length - 1];
  const dealsChange =
    activeDeals - KPI_HISTORY.activeDeals[KPI_HISTORY.activeDeals.length - 1];
  const sizeChange = percentChange(KPI_HISTORY.avgDealSize, avgDealSize);

  return [
    {
      id: "new-leads",
      label: "Leads this week",
      value: NEW_LEADS_THIS_WEEK.toLocaleString("en-US"),
      ...describeChange(leadsChange, (n) => `${n.toFixed(1)}%`),
      comparison: "vs last week",
      history: withCurrent(KPI_HISTORY.newLeads, NEW_LEADS_THIS_WEEK),
    },
    {
      id: "win-rate",
      label: "Win rate",
      value: `${winRate}%`,
      ...describeChange(winRateChange, (n) => `${n} ${n === 1 ? "pt" : "pts"}`),
      comparison: "vs last week",
      history: withCurrent(KPI_HISTORY.winRate, winRate),
    },
    {
      id: "active-deals",
      label: "Active deals",
      value: String(activeDeals),
      ...describeChange(dealsChange, String),
      comparison: "vs last week",
      history: withCurrent(KPI_HISTORY.activeDeals, activeDeals),
    },
    {
      id: "avg-deal-size",
      label: "Avg. deal size",
      value: formatCompactCurrency(avgDealSize),
      ...describeChange(sizeChange, (n) => `${n.toFixed(1)}%`),
      comparison: "vs last week",
      history: withCurrent(KPI_HISTORY.avgDealSize, avgDealSize),
    },
  ];
}

/** Turns a signed change into display text; for all four KPIs, up is good. */
function describeChange(
  change: number,
  format: (magnitude: number) => string,
): Pick<Kpi, "delta" | "direction" | "isGood"> {
  // Treat rounding noise (e.g. +0.04%) as no change.
  if (Math.abs(change) < 0.05) {
    return { delta: "No change", direction: "flat", isGood: true };
  }
  return {
    delta: format(Math.abs(change)),
    direction: change > 0 ? "up" : "down",
    isGood: change > 0,
  };
}

/** Typical close rates per open stage, used to weight the forecast. */
const STAGE_PROBABILITY: Partial<Record<DealStage, number>> = {
  qualified: 0.2,
  proposal: 0.5,
  negotiation: 0.75,
};

function getPipelineByStage(deals: DealWithContact[]): StagePipeline[] {
  return DEAL_STAGES.filter((stage) => isOpenDeal({ stage: stage.id })).map(
    (stage) => {
      const inStage = deals.filter((deal) => deal.stage === stage.id);
      return {
        stage: stage.id,
        label: stage.label,
        count: inStage.length,
        value: sumDealValues(inStage),
        probability: STAGE_PROBABILITY[stage.id] ?? 0,
      };
    },
  );
}

function getClosingSoon(deals: DealWithContact[], limit: number): UpcomingDeal[] {
  return deals
    .filter((deal) => isOpenDeal(deal) && deal.expectedClose >= DEMO_TODAY)
    .sort((a, b) => a.expectedClose.localeCompare(b.expectedClose))
    .slice(0, limit)
    .map((deal) => ({
      ...deal,
      daysUntilClose: daysBetween(DEMO_TODAY, deal.expectedClose),
    }));
}

export async function getDashboardData() {
  const deals = await getDeals();
  return {
    revenue: getRevenuePace(),
    kpis: getKpis(deals),
    pipeline: getPipelineByStage(deals),
    closingSoon: getClosingSoon(deals, 5),
    recentContacts: getRecentContacts(5),
  };
}
