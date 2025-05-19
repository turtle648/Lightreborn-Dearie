"use client"

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Save, Music2, Search, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { submitMissionCompletion } from "@/apis/mission-api";
import { useSearchParams, useRouter } from "next/navigation";

export default function MusicMissionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const userMissionId = Number(searchParams.get("userMissionId"));
  const missionId = Number(searchParams.get("missionId"));
  const router = useRouter();

  // 검색
  const searchMusic = async () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&entity=song&limit=1`
      );
      const data = await res.json();
      if (data.results.length > 0) {
        setResult(data.results[0]);
      } else {
        setError("검색 결과가 없습니다. 다른 곡이나 가수를 입력해보세요.");
      }
    } catch (e) {
      setError("검색 중 오류가 발생했습니다.");
    }
    setIsSearching(false);
  };

  // 미션 완료
  const completeMusicMission = async () => {
    if (!result || !userMissionId || !missionId) {
      console.error("필수 데이터가 부족합니다.");
      return;
    }

    try {
      await submitMissionCompletion(userMissionId, {
        missionId,
        missionExecutionType: "MUSIC",
        title: result.trackName,
        artist: result.artistName,
        musicImageUrl: result.artworkUrl100.replace("100x100", "600x600"),
      });

      setIsCompleted(true);
      setIsSaved(true);

      // ✅ 완료 후 상세 페이지로 이동
      router.push(
        `/mission/recent-success/${userMissionId}?type=MUSIC`
      );
      
    } catch (error) {
      console.error("음악 미션 제출 실패", error);
    }
  };

  // 다시 검색
  const resetMission = () => {
    setSearchTerm("");
    setResult(null);
    setIsCompleted(false);
    setIsSaved(false);
    setError("");
  };

  return (
    <AppLayout showBack title="음악 미션" rightAction={null}>
      <div className="flex flex-col h-full p-4">
        <div className="flex-1 mb-4">
          <Card className="h-full border-none shadow-md overflow-hidden">
            <CardContent className="p-6 h-full flex flex-col">
              {!result && !isCompleted ? (
                <div className="flex flex-col h-full">
                  <div className="mb-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold mb-2">오늘의 노래</h3>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg flex items-center gap-2">
                      <Music2 className="h-5 w-5 text-primary" />
                      <span className="text-primary font-medium">오늘 어떤 노래를 들으셨나요?</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="노래 제목이나 가수를 입력하세요"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && searchMusic()}
                        className="w-full p-4 pl-12 pr-4 rounded-full border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors bg-white shadow-sm"
                      />
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                    <Button
                      onClick={searchMusic}
                      disabled={isSearching || !searchTerm.trim()}
                      className="w-full mt-4 py-3 rounded-full bg-gradient-soft shadow-lg shadow-primary/20 font-medium disabled:opacity-50"
                    >
                      {isSearching ? "검색 중..." : "검색하기"}
                    </Button>
                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col h-full"
                >
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">검색 결과</h3>
                    <div className="p-6 bg-gray-50 rounded-2xl flex flex-col items-center shadow-md">
                      <div className="w-44 h-44 relative mb-6 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                        <Image
                          src={result.artworkUrl100.replace('100x100', '600x600')}
                          alt={result.trackName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-center w-full">
                        <p className="text-2xl font-extrabold mb-1 text-gray-900">{result.trackName}</p>
                        <p className="text-lg font-semibold mb-1 text-pink-500">{result.artistName}</p>
                        <p className="text-gray-500 text-base mb-4">{result.collectionName}</p>
                      </div>
                      <div className="w-full flex justify-center">
                        <div className="w-full max-w-xs bg-white/80 rounded-xl shadow-inner px-4 py-3 flex flex-col items-center">
                          <audio controls className="w-full" style={{ background: 'transparent' }} controlsList="nodownload">
                            <source src={result.previewUrl} type="audio/mpeg" />
                            미리듣기를 지원하지 않는 브라우저입니다.
                          </audio>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={completeMusicMission}
                    className="w-full py-3 rounded-full bg-gradient-soft shadow-lg shadow-primary/20 mt-4"
                  >
                    <Save className="mr-2 h-5 w-5" />
                    감상 완료
                  </Button>
                  <Button
                    onClick={resetMission}
                    variant="ghost"
                    className="w-full mt-2 py-3 rounded-full border border-pink-200 text-pink-500 hover:bg-pink-50"
                  >
                    다른 노래 검색하기
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
