'use client';

export default function AdminActivitySummary() {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-bold mb-4">Platform Activity Summary</h2>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>12 new users registered this week</li>
        <li>5 dealers approved in last 7 days</li>
        <li>28 cars recycled this month</li>
        <li>2 flagged users pending review</li>
      </ul>
    </div>
  );
}