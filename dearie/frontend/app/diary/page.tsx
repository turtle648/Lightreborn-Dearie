import { AppLayout } from "@/components/app-layout"
import { DiaryList } from "@/components/diary-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function DiaryPage() {
  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">나의 일기</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <Search className="h-5 w-5" />
            </Button>
            <Select defaultValue="latest">
              <SelectTrigger className="w-[100px] rounded-full border-none bg-gray-100">
                <SelectValue placeholder="정렬" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">최신순</SelectItem>
                <SelectItem value="oldest">오래된순</SelectItem>
                <SelectItem value="emotion">감정순</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DiaryList />
      </div>
    </AppLayout>
  )
}
