import { AppLayout } from "@/components/app-layout"
import { MissionList } from "@/components/mission-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

export default function MissionPage() {
  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">오늘의 미션</h1>
          <Button variant="outline" size="sm" className="gap-1 rounded-full">
            <Filter className="h-4 w-4" />
            필터
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6 bg-gray-100/80 p-1 rounded-full">
            <TabsTrigger value="all" className="rounded-full">
              전체
            </TabsTrigger>
            <TabsTrigger value="mindfulness" className="rounded-full">
              마음챙김
            </TabsTrigger>
            <TabsTrigger value="emotion" className="rounded-full">
              감정
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-full">
              활동
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <MissionList />
          </TabsContent>
          <TabsContent value="mindfulness">
            <MissionList category="mindfulness" />
          </TabsContent>
          <TabsContent value="emotion">
            <MissionList category="emotion" />
          </TabsContent>
          <TabsContent value="activity">
            <MissionList category="activity" />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
