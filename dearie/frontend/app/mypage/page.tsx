import { AppLayout } from "@/components/app-layout";
import { UserProfile } from "@/components/user-profile";
import { EmotionStats } from "@/components/emotion-stats";
import { RecentActivity } from "@/components/recent-activity";
import { SurveySelection } from "@/components/survey-selection";

export default function MyPage() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <UserProfile />
        <SurveySelection />
        <EmotionStats />
        <RecentActivity />
      </div>
    </AppLayout>
  );
}
