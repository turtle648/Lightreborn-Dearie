"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { DiaryList } from "@/components/diary-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Bookmark, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export default function DiaryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex flex-col mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">나의 일기</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => setShowSearch(!showSearch)}
                aria-label={showSearch ? "검색창 닫기" : "검색창 열기"}
              >
                {showSearch ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </Button>
              <Select
                value={sortOrder}
                onValueChange={(value: string) =>
                  setSortOrder(value as "latest" | "oldest")
                }
              >
                <SelectTrigger className="w-[100px] rounded-full border-none bg-gray-100">
                  <SelectValue placeholder="정렬" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">최신순</SelectItem>
                  <SelectItem value="oldest">오래된순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-4"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="일기 내용 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-2 w-full rounded-full border-gray-200 focus:border-primary focus:ring-primary"
                  />
                  {searchQuery && (
                    <button
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setSearchQuery("")}
                      aria-label="검색어 지우기"
                    >
                      <X className="h-4 w-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end items-center mb-4">
            <div className="flex items-center">
              <Checkbox
                id="bookmark-filter"
                className="h-4 w-4 text-primary border-primary/50"
                checked={bookmarkedOnly}
                onCheckedChange={(checked) =>
                  setBookmarkedOnly(checked === true)
                }
              />
              <Label
                htmlFor="bookmark-filter"
                className="ml-2 text-sm text-gray-600 flex items-center cursor-pointer"
              >
                <Bookmark className="h-4 w-4 mr-1 text-primary" />
                북마크만 보기
              </Label>
            </div>
          </div>
        </div>

        <DiaryList
          searchQuery={searchQuery}
          sortOrder={sortOrder}
          bookmarkedOnly={bookmarkedOnly}
        />
      </div>
    </AppLayout>
  );
}
