import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsCollection } from '@/lib/mongodb';

export async function GET(_request: NextRequest) {
  try {
    const collection = await getAnalyticsCollection();

    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const twelveDaysAgo = new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000);

    type PageViewsAggItem = { _id: string; views: number };
    type TrafficSourceAggItem = { _id: string | null; count: number };
    type DailyVisitsAggItem = {
      _id: { year: number; month: number; day: number };
      count: number;
    };
    type RecentVisitorItem = {
      timestamp: Date | string;
      geo?: {
        country?: string | null;
        region?: string | null;
        city?: string | null;
        latitude?: number | null;
        longitude?: number | null;
      } | null;
    };

    const [totalVisitorsAgg, activeUsersAgg, pageViewsAgg, trafficSourcesAgg, dailyVisitsAgg, recentVisitors] =
      await Promise.all<any>([
        collection.distinct('sessionId'),
        collection.distinct('sessionId', { timestamp: { $gte: fiveMinutesAgo } }),
        collection
          .aggregate([
            { $group: { _id: '$path', views: { $sum: 1 } } },
            { $sort: { views: -1 } },
            { $limit: 50 },
          ])
          .toArray() as Promise<PageViewsAggItem[]>,
        collection
          .aggregate([
            {
              $project: {
                refDomain: {
                  $cond: [
                    { $ifNull: ['$referrer', false] },
                    {
                      $arrayElemAt: [
                        {
                          $split: [
                            {
                              $arrayElemAt: [
                                {
                                  $split: [
                                    {
                                      $cond: [
                                        { $eq: [{ $substr: ['$referrer', 0, 4] }, 'http'] },
                                        '$referrer',
                                        null,
                                      ]
                                    },
                                    '/',
                                  ],
                                },
                                2,
                              ],
                            },
                            '?',
                          ],
                        },
                        0,
                      ],
                    },
                    null,
                  ],
                },
              },
            },
            { $group: { _id: '$refDomain', count: { $sum: 1 } } },
          ])
          .toArray(),
        collection
          .aggregate([
            { $match: { timestamp: { $gte: twelveDaysAgo } } },
            {
              $group: {
                _id: {
                  year: { $year: '$timestamp' },
                  month: { $month: '$timestamp' },
                  day: { $dayOfMonth: '$timestamp' },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
          ])
          .toArray() as Promise<DailyVisitsAggItem[]>,
        collection
          .find({}, { projection: { timestamp: 1, geo: 1, path: 1, sessionId: 1 } })
          .sort({ timestamp: -1 })
          .limit(20)
          .toArray() as unknown as Promise<RecentVisitorItem[]>,
      ]);

    const totalVisitors = (totalVisitorsAgg || []).length;
    const activeUsers = (activeUsersAgg || []).length;

    const pageViews: Record<string, number> = {};
    for (const item of pageViewsAgg) {
      pageViews[item._id || 'unknown'] = item.views;
    }

    const totalTraffic:any = trafficSourcesAgg.reduce((sum: number, item: TrafficSourceAggItem) => sum + item.count, 0) || 1;

    const trafficSources = trafficSourcesAgg
      .map((item: TrafficSourceAggItem) => {
        const source = item._id || 'Direct';
        const percentage = Math.round((item.count / totalTraffic) * 100);
        return { source, percentage };
      })
      .filter((item:any) => item.percentage > 0)
      .slice(0, 10);

    const dailyVisits: number[] = [];
    const countsByDateKey: Record<string, number> = {};
    for (const item of dailyVisitsAgg as DailyVisitsAggItem[]) {
      const { year, month, day } = item._id;
      const key = `${year}-${month}-${day}`;
      countsByDateKey[key] = item.count;
    }

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      dailyVisits.push(countsByDateKey[key] || 0);
    }

    const recentVisitorsFormatted = (recentVisitors as RecentVisitorItem[]).map((item) => {
      const ts = item.timestamp instanceof Date ? item.timestamp : new Date(item.timestamp);
      const minutesAgo = Math.floor((now.getTime() - ts.getTime()) / 60000);
      let timeLabel = `${minutesAgo} min ago`;
      if (minutesAgo >= 60) {
        const hours = Math.floor(minutesAgo / 60);
        timeLabel = `${hours} h ago`;
      }

      const geo = item.geo || {};

      return {
        country: geo.country || 'Unknown',
        city: geo.city || geo.region || 'Unknown',
        time: timeLabel,
        pages: 1,
      };
    });

    const response = {
      totalVisitors,
      activeUsers,
      avgSessionDuration: 'N/A',
      bounceRate: 'N/A',
      pageViews,
      trafficSources,
      recentVisitors: recentVisitorsFormatted,
      dailyVisits,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in /api/analytics/stats:', error);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
