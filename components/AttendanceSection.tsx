import React from 'react';
import { CalendarCheck2 } from 'lucide-react';
import ProfileSection from './ProfileSection';
import AttendanceChart from './charts/AttendanceChart';
import { AttendanceData, MonthlyAttendance } from '../types';
import { calculateAttendancePercentage, sanitizeText } from '../utils/formatter';
import { BORDER_RADIUS } from '../constants';

interface AttendanceSectionProps {
  attendance?: AttendanceData;
}

interface MonthlySummaryItemProps {
  month: string;
  data: MonthlyAttendance;
}

const MonthlySummaryItem: React.FC<MonthlySummaryItemProps> = ({ month, data }) => (
  <li className={`p-3 border-b border-slate-200 last:border-b-0 grid grid-cols-3 gap-2 items-center text-sm hover:bg-slate-50 transition-colors`}>
    <span className="font-medium text-blue-600">{sanitizeText(month)}</span>
    <span className="text-slate-600 text-center">
      {data.present} Present / {data.absent} Absent ({data.workingDays} Days)
    </span>
    <span className="font-semibold text-slate-700 text-right">
      {calculateAttendancePercentage(data.present, data.workingDays)}
    </span>
  </li>
);

const AttendanceSection: React.FC<AttendanceSectionProps> = ({ attendance }) => {
  if (!attendance) {
    return (
      <ProfileSection title="Attendance Records" icon={<CalendarCheck2 size={24} />}>
        <p className="text-slate-500">Attendance information not available.</p>
      </ProfileSection>
    );
  }

  const {
    totalSchoolDaysCounted = 0,
    totalPresent = 0,
    totalAbsent = 0,
    byMonth = {}
  } = attendance;

  const overallAttendancePercentage = calculateAttendancePercentage(totalPresent, totalSchoolDaysCounted);

  const sortedMonths = Object.keys(byMonth).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // Assuming month keys are parseable dates e.g. "January 2023"

  return (
    <ProfileSection title="Attendance Records" icon={<CalendarCheck2 size={24} />} id="attendance-info-section">
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 ${BORDER_RADIUS}`}>
        <div className="text-center">
          <strong className="block text-2xl font-bold text-green-600">{totalPresent}</strong>
          <span className="text-sm text-slate-500">Days Present</span>
        </div>
        <div className="text-center">
          <strong className="block text-2xl font-bold text-red-600">{totalAbsent}</strong>
          <span className="text-sm text-slate-500">Days Absent</span>
        </div>
        <div className="text-center">
          <strong className="block text-2xl font-bold text-blue-600">{overallAttendancePercentage}</strong>
          <span className="text-sm text-slate-500">Overall Attendance</span>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-slate-700 mb-2">Monthly Attendance Summary</h3>
      {sortedMonths.length > 0 ? (
        <ul className={`border border-slate-200 ${BORDER_RADIUS} max-h-72 overflow-y-auto`}>
          {sortedMonths.map(month => (
            <MonthlySummaryItem key={month} month={month} data={byMonth[month]} />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500 p-3 bg-slate-50 rounded-md text-center">No monthly attendance data.</p>
      )}
      
      <h3 className="text-lg font-semibold text-slate-700 mt-8 mb-2">Monthly Attendance Trend</h3>
      <AttendanceChart attendanceByMonth={byMonth} />
    </ProfileSection>
  );
};

export default AttendanceSection;
