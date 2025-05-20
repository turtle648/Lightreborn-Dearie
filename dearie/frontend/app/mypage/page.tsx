import { AppLayout } from "@/components/app-layout";
import { UserProfile } from "@/components/user-profile";
import { WeeklyReportPreview } from "@/components/weekly-report-preview";
import { RecentActivity } from "@/components/recent-activity";
import { SurveySelection } from "@/components/survey-selection";

export default function MyPage() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <UserProfile />
        <SurveySelection />
        <WeeklyReportPreview />
        <RecentActivity />
      </div>
    </AppLayout>
  );
}
