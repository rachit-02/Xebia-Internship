import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, Edit3, Mail, MapPin, Phone, Users } from 'lucide-react';
import { DepartmentHeader } from '../components/DepartmentHeader';
import { DepartmentStats } from '../components/DepartmentStats';
import { DepartmentTabs, type DepartmentTabKey } from '../components/DepartmentTabs';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { StatusBadge } from '../components/StatusBadge';
import { getDepartmentById, getDepartmentSeries, getDepartmentStats } from '../api/departments';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';

export function DepartmentDetailsPage() {
  const { departmentId = '' } = useParams();
  const [tab, setTab] = useState<DepartmentTabKey>('overview');

  const query = useQuery({ queryKey: ['department', departmentId], queryFn: async () => getDepartmentById(departmentId) });
  const department = query.data;

  const series = useMemo(() => (department ? getDepartmentSeries(department) : []), [department]);

  if (query.isLoading) return <LoadingSkeleton />;
  if (query.isError || !department) return <ErrorState message="The department details could not be loaded." onRetry={() => query.refetch()} />;

  return (
    <div className="space-y-6">
      <DepartmentHeader
        title={department.name}
        subtitle="Department profile, operations, activity, and analytics in a single enterprise view."
        showActions={false}
      />

      <Card className="overflow-hidden p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-primary-soft px-3 py-1 text-sm font-semibold text-primary">{department.code}</span>
              <StatusBadge status={department.status} />
            </div>
            <h2 className="mt-4 text-3xl font-bold text-heading">{department.name}</h2>
            <p className="mt-3 max-w-3xl text-sm text-text">Managed by {department.hod}. {department.description}</p>
          </div>
          <Link to={`/departments/${department.id}/edit`}>
            <Button icon={<Edit3 className="h-4 w-4" />}>Edit Department</Button>
          </Link>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={department.email} />
          <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={department.phone} />
          <InfoRow icon={<MapPin className="h-4 w-4" />} label="Building" value={department.building} />
          <InfoRow icon={<CalendarDays className="h-4 w-4" />} label="Updated" value={new Date(department.updatedAt).toLocaleDateString()} />
        </div>
      </Card>

      <DepartmentStats items={getDepartmentStats(department)} />
      <DepartmentTabs value={tab} onChange={setTab} />

      {tab === 'overview' ? (
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-heading">Overview</h3>
              <p className="mt-3 text-sm leading-7 text-text">{department.description}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-heading">Recent Activity Timeline</h3>
              <div className="mt-5 space-y-4">
                {department.activity.map((entry) => (
                  <div key={entry.label} className="flex gap-4 rounded-2xl border border-border bg-surface-muted p-4">
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                    <div>
                      <p className="font-semibold text-heading">{entry.label}</p>
                      <p className="mt-1 text-sm text-text">{entry.detail}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted">{entry.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-heading">Department Leadership</h3>
              <div className="mt-4 rounded-2xl border border-border bg-surface-muted p-4">
                <p className="text-sm font-semibold text-heading">{department.hod}</p>
                <p className="mt-1 text-sm text-text">Head of Department</p>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-heading">Announcements</h3>
              <div className="mt-4 space-y-3">
                {department.announcements.map((announcement) => (
                  <div key={announcement.title} className="rounded-2xl border border-border p-4">
                    <p className="font-semibold text-heading">{announcement.title}</p>
                    <p className="mt-1 text-sm text-text">{announcement.body}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-heading">Upcoming Events</h3>
              <div className="mt-4 space-y-3">
                {department.upcomingEvents.map((event) => (
                  <div key={event.title} className="rounded-2xl border border-border p-4">
                    <p className="font-semibold text-heading">{event.title}</p>
                    <p className="mt-1 text-sm text-text">{event.date} · {event.location}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      ) : null}

      {tab === 'faculty' ? (
        <Card className="p-6">
          <h3 className="text-xl font-bold text-heading">Faculty Preview</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-2xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary"><Users className="h-4 w-4" /></div>
                  <div>
                    <p className="font-semibold text-heading">Faculty Member {index + 1}</p>
                    <p className="text-sm text-text">Professor</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {tab === 'students' ? (
        <Card className="p-6">
          <h3 className="text-xl font-bold text-heading">Student Cohorts</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {['First Year', 'Second Year', 'Third Year', 'Final Year'].map((label, index) => (
              <div key={label} className="rounded-2xl border border-border p-4">
                <p className="text-sm text-text">{label}</p>
                <p className="mt-2 text-2xl font-bold text-heading">{Math.round(department.studentCount / 4 + index * 8)}</p>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {tab === 'courses' ? (
        <Card className="p-6">
          <h3 className="text-xl font-bold text-heading">Course Completion</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: department.courses }).slice(0, 6).map((_, index) => (
              <div key={index} className="rounded-2xl border border-border p-4">
                <p className="font-semibold text-heading">Course {index + 1}</p>
                <p className="mt-2 text-sm text-text">Completion {72 + index}%</p>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {tab === 'analytics' ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-xl font-bold text-heading">Enrollment Trend</h3>
            <div className="mt-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6E8F0" />
                  <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="enrollment" stroke="#6C1D5F" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="faculty" stroke="#01AC9F" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-bold text-heading">Student Performance</h3>
            <div className="mt-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6E8F0" />
                  <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="performance" fill="#793B74" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-muted p-4">
      <div className="flex items-center gap-2 text-muted">
        {icon}
        <span className="text-xs font-medium uppercase tracking-[0.18em]">{label}</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-heading">{value}</p>
    </div>
  );
}
