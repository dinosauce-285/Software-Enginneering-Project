import React from 'react';
const mockNotifications = [
  { id: 1, type: 'memory', message: "Remember what you wrote on this day last year.", time: '15 minutes ago', link: '/posts/123' },
  { id: 2, type: 'prompt', message: "A new week has begun! Time to jot down your thoughts.", time: '2 hours ago', link: '/new' },
  { id: 3, type: 'memory', message: "Your memory from 2 years ago: 'Feeling hopeful about the new project'.", time: 'Yesterday', link: '/posts/456' },
  { id: 4, type: 'prompt', message: "Did anything make you smile today?", time: '2 days ago', link: '/new' },
  { id: 5, type: 'memory', message: "A look back at your trip to the mountains 3 years ago.", time: '3 days ago', link: '/posts/789' },
  { id: 6, type: 'prompt', message: "What's one thing you learned this week?", time: '4 days ago', link: '/new' },
  { id: 7, type: 'memory', message: "You wrote about starting a new book a month ago.", time: '5 days ago', link: '/posts/101' },
  { id: 8, type: 'prompt', message: "Don't forget to capture today's little moments.", time: '6 days ago', link: '/new' },
  { id: 9, type: 'memory', message: "Flashback: Your goals for the year, set 6 months ago.", time: '7 days ago', link: '/posts/202' },
  { id: 10, type: 'prompt', message: "What are you grateful for right now?", time: 'Last week', link: '/new' },
  { id: 11, type: 'memory', message: "Revisit your thoughts on 'The Big Move' from last year.", time: 'Last week', link: '/posts/303' },
  { id: 12, type: 'prompt', message: "Is there a challenge you're currently facing? Write it out.", time: 'Last week', link: '/new' },
];


export default function NotificationPanel() {
  const handleNotificationClick = (link) => {
    console.log(`Navigating to: ${link}`);
  };

  return (
    <div className="absolute top-0 left-full ml-4 h-full w-96 flex flex-col bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 shrink-0">
        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
      </div>

      <div className="flex-grow overflow-y-auto">
        {mockNotifications.length > 0 ? (
          <ul>
            {mockNotifications.map((item) => (
              <li
                key={item.id}
                onClick={() => handleNotificationClick(item.link)}
                className="p-4 hover:bg-gray-50 border-b border-gray-100 transition cursor-pointer"
              >
                <p className="text-sm text-gray-700">{item.message}</p>
                <p className="text-xs text-gray-400 mt-1">{item.time}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500">
            You're all caught up.
          </div>
        )}
      </div>
    </div>
  );
}