'use client';

import { useEffect, useState } from 'react';
import { fetchReportSummary, ReportSummaryResponse } from '@/apis/report-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Props {
  userId: number;
  date: string; // yyyy-mm-dd
  diaryCount: number;
}

const ReportSummary = ({ userId, date, diaryCount }: Props) => {
  const [data, setData] = useState<ReportSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (diaryCount === 0) {
      setLoading(false);
      setData(null);
      setError(null);
      return;
    }
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchReportSummary(userId, date);
        setData(result);
        setError(null);
      } catch (err) {
        setError('데이터를 불러오는데 실패했습니다.');
        console.error('Failed to fetch report summary:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId, date, diaryCount]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">불러오는 중...</div>
        </CardContent>
      </Card>
    );
  }

  if (diaryCount === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center">작성한 일기가 없습니다.</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center">데이터가 없습니다.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>오늘의 감정 요약</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">감정 분석</h3>
          <p className="text-gray-600">{data.summary}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">감정 점수</h3>
          <div className="space-y-4">
            {Object.entries(data.emotionScores).map(([emotion, score]) => (
              <div key={emotion} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{emotion}</span>
                  <span>{score}%</span>
                </div>
                <Progress value={score} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        {data.needSurvey && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg">
            <p className="text-red-600 mb-2">
              슬픔/불안/분노 감정이 높습니다. 심리 상태를 확인해보세요.
            </p>
            <Button asChild variant="destructive">
              <Link href="/survey">심리 상태 체크하기</Link>
            </Button>
          </div>
        )}

        {data.comment && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-600">{data.comment}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportSummary; 