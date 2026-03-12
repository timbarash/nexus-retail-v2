import { AlertCircle, ArrowBigUp, MessageCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import PageHeader from '../components/PageHeader';
import SentimentBadge from '../components/SentimentBadge';
import { subreddits, positiveThemes, negativeThemes, samplePosts } from '../data/social';

export default function SocialRedditPulse() {
  return (
    <div>
      <PageHeader
        title="Social & Reddit Pulse"
        subtitle="Community sentiment from cannabis subreddits across AWH markets"
      />

      {/* Disclaimer */}
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <AlertCircle size={20} className="mt-0.5 shrink-0 text-blue-600" />
        <p className="text-sm text-blue-800">
          Social &amp; Reddit data is directional and estimated. Mention counts and sentiment scores
          are modeled from public discussions and do not represent exact measurements.
        </p>
      </div>

      {/* Monitored Subreddits */}
      <h2 className="mb-3 text-lg font-semibold text-navy-900">Monitored Subreddits</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {subreddits.map((sub) => (
          <div key={sub.name} className="rounded-xl border border-gray-100 bg-white shadow-sm p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-dutchie-500">{sub.name}</p>
                <p className="text-xs text-gray-500">{sub.state}</p>
              </div>
              <SentimentBadge sentiment={sub.sentiment} />
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-500">{sub.members} members</span>
              <span className="font-medium text-gray-600">{sub.mentionCount} <span className="font-normal text-gray-500">mentions</span></span>
            </div>
          </div>
        ))}
      </div>

      {/* Theme Mentions */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
          <h2 className="mb-4 text-lg font-semibold text-navy-900">Positive Themes</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart layout="vertical" data={positiveThemes} margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="theme" width={160} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e3e7e9' }} />
              <Bar dataKey="count" fill="#00a47c" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
          <h2 className="mb-4 text-lg font-semibold text-navy-900">Negative Themes</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart layout="vertical" data={negativeThemes} margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="theme" width={160} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e3e7e9' }} />
              <Bar dataKey="count" fill="#d94040" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sample Posts */}
      <h2 className="mt-8 mb-3 text-lg font-semibold text-navy-900">Sample Reddit Posts</h2>
      <div className="space-y-3">
        {samplePosts.map((post) => (
          <div key={post.id} className="rounded-xl border border-gray-100 bg-white shadow-sm p-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-dutchie-500">{post.subreddit}</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-400">{post.date}</span>
              <SentimentBadge sentiment={post.sentiment} />
            </div>
            <h3 className="mt-1.5 text-sm font-medium text-navy-900">{post.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{post.snippet}</p>
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <ArrowBigUp size={14} />
                {post.upvotes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={14} />
                {post.comments}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
