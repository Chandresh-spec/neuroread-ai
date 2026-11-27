import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { INITIAL_NOTIFICATIONS } from '../data/notificationsData';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'activity', label: 'Activity' },
  { id: 'ai', label: 'AI' },
  { id: 'files', label: 'Files' },
];

const CATEGORY_LABELS = {
  activity: 'Activity',
  ai: 'AI',
  files: 'Files',
};

export default function NotificationsPage({
  notifications: controlledNotifications,
  onUpdateNotifications,
  onBack,
}) {
  const [internalNotifications, setInternalNotifications] = useState(INITIAL_NOTIFICATIONS);
  const notifications = controlledNotifications ?? internalNotifications;
  const setNotifications = onUpdateNotifications ?? setInternalNotifications;

  const [activeFilter, setActiveFilter] = useState('all');

  const unreadCount = notifications.filter((n) => n.unread).length;
  const total = notifications.length;

  const countByCategory = (categoryId) => {
    if (categoryId === 'all') return total;
    return notifications.filter((n) => n.category === categoryId).length;
  };

  const filtered =
    activeFilter === 'all'
      ? notifications
      : notifications.filter((n) => n.category === activeFilter);

  const today = filtered.filter((n) => n.group === 'today');
  const earlier = filtered.filter((n) => n.group !== 'today');

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleMarkRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="-mx-4 -my-6 sm:-mx-6 sm:-my-8 lg:-mx-10 xl:-mx-12 -mb-6 min-h-[calc(100vh-68px)] bg-[#F7F8FA] px-4 sm:px-6 lg:px-10 xl:px-12 pt-5 sm:pt-7 pb-20 md:pb-12">
      <div className="w-full max-w-[920px] mx-auto">
        {/* Back link */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center min-h-[36px] text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors mb-4 sm:mb-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
          >
            Back
          </button>
        )}

        {/* Title + Count badge */}
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl sm:text-[36px] font-bold text-[#111827] tracking-tight leading-none">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span
              aria-label={`${unreadCount} unread`}
              className="inline-flex items-center justify-center min-w-[26px] h-[26px] sm:min-w-[28px] sm:h-7 px-2 rounded-full bg-[#111827] text-white text-xs sm:text-[13px] font-semibold tabular-nums flex-shrink-0"
            >
              {unreadCount}
            </span>
          )}
        </div>

        {/* Summary + Action Links */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2.5 sm:gap-4 mb-6 sm:mb-7">
          <p className="text-sm text-[#6B7280]">
            {total === 0 ? (
              'No notifications'
            ) : (
              <>
                <span className="font-semibold text-[#111827] tabular-nums">
                  {unreadCount} unread
                </span>{' '}
                of {total} notification{total !== 1 ? 's' : ''}
              </>
            )}
          </p>

          {notifications.length > 0 && (
            <div className="flex items-center gap-5 sm:gap-6 flex-shrink-0">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-sm font-medium text-[#111827] pb-0.5 border-b border-[#D1D5DB] hover:border-[#111827] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563EB]"
                >
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={handleClearAll}
                className="text-sm font-normal text-[#6B7280] hover:text-[#111827] pb-0.5 border-b border-[#E5E7EB] hover:border-[#6B7280] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563EB]"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Underline Tabs */}
        {notifications.length > 0 && (
          <div
            role="tablist"
            aria-label="Filter notifications"
            className="flex items-center gap-6 sm:gap-7 mb-7 overflow-x-auto scrollbar-none"
          >
            {FILTERS.map(({ id, label }) => {
              const isActive = activeFilter === id;
              const count = countByCategory(id);
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(id)}
                  className={`relative flex-shrink-0 inline-flex items-baseline gap-1.5 pb-2.5 text-sm transition-colors whitespace-nowrap border-b-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563EB] ${
                    isActive
                      ? 'border-[#111827] font-medium text-[#111827]'
                      : 'border-transparent font-normal text-[#6B7280] hover:text-[#111827]'
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`text-xs tabular-nums ${
                      isActive ? 'text-[#6B7280]' : 'text-[#9CA3AF]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl px-6 py-16 sm:py-20 text-center">
            <div className="w-11 h-11 rounded-xl bg-[#F3F4F6] flex items-center justify-center mx-auto mb-3.5">
              <Bell className="w-5 h-5 text-[#9CA3AF]" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-[#111827]">
              {notifications.length === 0 ? "You're all caught up" : 'No notifications here'}
            </p>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1 max-w-xs mx-auto">
              {notifications.length === 0
                ? 'New reading progress, summaries, and file uploads will appear here.'
                : `No notifications in ${CATEGORY_LABELS[activeFilter] || activeFilter} right now.`}
            </p>
            {notifications.length > 0 && activeFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#111827] text-white text-xs font-medium hover:bg-[#1F2937] transition-colors"
              >
                View all notifications
              </button>
            )}
          </div>
        )}

        {/* Grouped Cards */}
        <div className="space-y-7">
          {today.length > 0 && (
            <NotifGroup
              label="Today"
              items={today}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          )}
          {earlier.length > 0 && (
            <NotifGroup
              label="Earlier"
              items={earlier}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function NotifGroup({ label, items, onMarkRead, onDelete }) {
  return (
    <section aria-label={label}>
      <h2 className="text-xs font-medium text-[#6B7280] mb-2.5">{label}</h2>
      <div className="bg-white border border-[#E5E7EB] rounded-2xl divide-y divide-[#ECEEF2] overflow-hidden">
        {items.map((n) => (
          <NotifRow
            key={n.id}
            n={n}
            onMarkRead={onMarkRead}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}

function NotifRow({ n, onMarkRead, onDelete }) {
  const categoryLabel = CATEGORY_LABELS[n.category] || n.category;

  return (
    <div
      onClick={() => {
        if (n.unread) onMarkRead(n.id);
      }}
      className={`group relative flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-6 px-4 py-4 sm:px-6 sm:py-5 border-l-[3px] transition-colors ${
        n.unread
          ? 'border-l-[#1D4ED8] bg-white hover:bg-[#FAFBFD] cursor-pointer'
          : 'border-l-transparent bg-white hover:bg-[#FAFAFB]'
      }`}
    >
      {/* Mobile Header Meta Row (< sm) */}
      <div className="flex sm:hidden items-center justify-between gap-2">
        <span className="text-xs text-[#6B7280] tabular-nums">{n.time}</span>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs ${
              n.unread ? 'font-semibold text-[#1D4ED8]' : 'font-normal text-[#6B7280]'
            }`}
          >
            {categoryLabel}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(n.id);
            }}
            aria-label={`Dismiss "${n.title}"`}
            className="w-6 h-6 -mr-1 rounded-md flex items-center justify-center text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Desktop/Tablet Left Timestamp Column (sm+) */}
      <div className="hidden sm:block sm:w-28 md:w-32 flex-shrink-0">
        <span className="text-xs text-[#6B7280] tabular-nums">{n.time}</span>
      </div>

      {/* Center Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug ${
            n.unread ? 'font-semibold text-[#111827]' : 'font-normal text-[#1F2937]'
          }`}
        >
          {n.title}
        </p>
        <p className="text-[13px] text-[#6B7280] mt-1 leading-relaxed">{n.body}</p>
      </div>

      {/* Desktop/Tablet Right Category & Hover Dismiss (sm+) */}
      <div className="hidden sm:flex items-center justify-end gap-0 group-hover:gap-2 group-focus-within:gap-2 flex-shrink-0 transition-all">
        <span
          className={`text-xs whitespace-nowrap ${
            n.unread ? 'font-semibold text-[#1D4ED8]' : 'font-normal text-[#6B7280]'
          }`}
        >
          {categoryLabel}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(n.id);
          }}
          aria-label={`Dismiss "${n.title}"`}
          title="Dismiss"
          className="w-0 overflow-hidden group-hover:w-6 group-focus-within:w-6 h-6 rounded-md flex items-center justify-center text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
        >
          <X className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
