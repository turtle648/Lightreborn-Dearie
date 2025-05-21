'use client'

import { useState, useEffect } from "react"; 
import Button from "@/components/common/Button"; 
import { Card } from "@/components/common/Card"; 
import { Calendar as CalendarIcon, Search, X, Clock } from "lucide-react"; 
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useYouthConsultationStore } from "@/stores/useYouthConsultaionStore";
import { useRouter } from "next/navigation";

// 실제 API 응답 구조에 맞게 수정된 인터페이스
interface RegisteredYouth {
  id: number;
  name: string;
  age: number;
  status: string;       // 이전의 isolationLevel
  recentDate: string;   // 이전의 recentSurveyDate
  specialNote: string;  // 이전의 memoKeyword
}

// 등록된 청소년 리스트 타입
type RegisteredYouthList = RegisteredYouth[];

interface SimpleCalendarProps {
  value: Date;
  onChange: (date: Date) => void;
  minDate: Date;
}

// 간단한 캘린더 컴포넌트 정의
function SimpleCalendar({ value, onChange, minDate } : SimpleCalendarProps) {
  return (
    <div className="w-full">
      <style jsx global>{`
        /* 스타일 내용은 생략 - 기존과 동일 */
      `}</style>
      
      <Calendar 
        onChange={(value) => {
          if (value instanceof Date) {
            onChange(value)
          }
        }}
        value={value}
        locale="ko-KR"
        minDate={minDate}
        calendarType="gregory"
        nextLabel=">"
        prevLabel="<"
        next2Label={null}
        prev2Label={null}
        formatMonthYear={(locale, date) => 
          date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })
        }
        formatDay={(locale, date) => date.getDate().toString()}
      />
    </div>
  );
}

// 기존 인터페이스를 백엔드 데이터 구조에 맞게 수정
interface SearchResult {
  name: string;
  age: number;
  status?: string;        // 변경됨
  recentDate?: string;    // 변경됨
  specialNote?: string;   // 변경됨
  // id와 gender는 기존 SearchResult에 있던 필드
  id?: string;  // 임시로 사용할 수 있도록 optional로 설정
  gender?: string;  // 임시로 사용할 수 있도록 optional로 설정
}

export default function MakeNewConsultationPage() { 
  // 상담 유형 상태 
  const [consultationType, setConsultationType] = useState(""); 
   
  // 상담 일시 상태 
  const [consultationDate, setConsultationDate] = useState(new Date()); 
  const [consultationTime, setConsultationTime] = useState("");
   
  // 상담 대상자 검색 관련 상태 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]); 
  const [selectedClient, setSelectedClient] = useState<SearchResult | null>(null); 
   
  const [clients, setClients] = useState<SearchResult[]>([]);
  const { registeredYouthList, getRegisteredYouthList } = useYouthConsultationStore();

  const mapRegisteredYouthToSearchResult = (youthList: RegisteredYouthList): SearchResult[] => {
    return youthList.map((youth, index) => ({
      ...youth, // 모든 필드를 그대로 복사
      // id 필드가 이미 있으므로 명시적으로 다시 변환
      id: youth.id?.toString() || index.toString(),
      // gender 필드를 임의로 설정 (데이터에 없는 경우)
      // gender: '남' // 기본값, 실제 데이터에 성별 정보가 있다면 해당 정보 사용
    }));
  };

  useEffect(() => {
    getRegisteredYouthList();
  }, []);  // 의존성 배열에 함수 추가

  useEffect(() => {
    if (registeredYouthList && Array.isArray(registeredYouthList)) {
      console.log("registeredYouthList : ", registeredYouthList);
      setClients(mapRegisteredYouthToSearchResult(registeredYouthList));
    } else {
      console.warn("registeredYouthList is not an array:", registeredYouthList);
      setClients([]);  // 기본값으로 빈 배열 설정
    }
  }, [registeredYouthList]);

  const router = useRouter();

  // 상담 유형 옵션
  const consultationTypes = [
    { id: "initial", label: "초기상담" },
    { id: "regular", label: "정기상담" },
    { id: "special", label: "특별상담" }
  ];

  // 시간 옵션
  const timeOptions = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30"
  ];
   
  // 검색어 변경 시 결과 필터링 
  // 검색 로직 수정
  useEffect(() => { 
    if (searchTerm.trim() === "") { 
      setSearchResults([]); 
      return; 
    } 
      
    const filteredResults = clients.filter(client => 
      client.name.includes(searchTerm) || 
      (client.id && client.id.includes(searchTerm))
    ); 
      
    setSearchResults(filteredResults); 
  }, [searchTerm, clients]); // clients 의존성 추가
   
  // 상담 대상자 선택 함수 
  const handleSelectClient = (client: SearchResult) => { 
    setSelectedClient(client); 
    setSearchTerm(""); 
    setSearchResults([]); 
  }; 
   
  // 선택한 상담 대상자 제거 함수 
  const handleRemoveSelectedClient = () => { 
    setSelectedClient(null); 
  }; 
   
  const { makeNewConsultation } = useYouthConsultationStore();

  // 날짜 선택 함수 
  const handleDateSelect = (date: Date) => { 
    setConsultationDate(date); 
  }; 
   
  // 폼 제출 함수 
const handleSubmit = () => { 
  // 유효성 검사 
  if (!consultationType) { 
    alert("상담 유형을 선택해주세요."); 
    return; 
  } 
     
  if (!consultationDate) { 
    alert("상담 일시를 선택해주세요."); 
    return; 
  } 

  if (!consultationTime) {
    alert("상담 시간을 선택해주세요.");
    return;
  }
     
  if (!selectedClient) { 
    alert("상담 대상자를 선택해주세요."); 
    return; 
  } 
  
  // API 명세에 맞게 날짜만 문자열로 변환 (yyyy-MM-dd 형식)
  const formattedDate = format(consultationDate, 'yyyy-MM-dd');
  
  // 콘솔 로그로 확인
  console.log("전송 데이터:", formattedDate);
  
  try {
    // 날짜 문자열을 직접 전송
    makeNewConsultation(Number(selectedClient.id), formattedDate);
    router.push(`/dashboard/consultation-management`);
  } catch (error) {
    console.error("makeNewConsultation error : ", error);
  }
};
   
  // 날짜 포맷팅 함수
  const formatDate = (date: Date) => {
    if (!date) return null;
    return format(date, 'yyyy. MM. dd (E)', { locale: ko });
  };

  return ( 
    <div className="min-h-screen flex items-center justify-center"> 
      <Card title="상담 일정 추가하기" className="max-w-5xl w-full"> 
        <div className="w-full flex flex-col md:flex-row p-4"> 
          {/* 왼쪽 캘린더 영역 */}
          <div className="w-full md:w-1/2 p-4 mr-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">상담 날짜 선택</h3>
              <p className="text-sm text-gray-500">
                {consultationDate ? formatDate(consultationDate) : '날짜를 선택해주세요'}
              </p>
            </div>
            <div id="calendar-container" className="w-full">
              <SimpleCalendar
                onChange={handleDateSelect}
                value={consultationDate}
                minDate={new Date()}
              />
            </div>
          </div>
          
          {/* 오른쪽 정보 입력 영역 */}
          <div className="w-full md:w-1/2 p-4 flex flex-col gap-6">
            {/* 선택한 날짜 표시 */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-center gap-2">
                <CalendarIcon size={18} className="text-blue-600" />
                <span className="font-medium text-blue-700">
                  {consultationDate ? formatDate(consultationDate) : '날짜를 선택해주세요'}
                </span>
              </div>
            </div>
            
            {/* 상담 유형 선택 영역 */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">상담유형</label>
              <div className="flex flex-wrap gap-3">
                {consultationTypes.map((type) => (
                  <label key={type.id} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="consultationType"
                      value={type.label}
                      checked={consultationType === type.label}
                      onChange={() => setConsultationType(type.label)}
                      className="hidden"
                    />
                    <div className={`px-4 py-2 rounded-md border ${
                      consultationType === type.label 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    } transition-colors duration-200`}>
                      {type.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            {/* 상담 시간 선택 영역 */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">상담시간</label>
              <div className="relative">
                <select
                  value={consultationTime}
                  onChange={(e) => setConsultationTime(e.target.value)}
                  className={`w-full p-2 border rounded-md bg-white appearance-none pr-8 ${
                    !consultationTime ? 'text-gray-400' : 'text-gray-700'
                  }`}
                >
                  <option value="" disabled>시간 선택</option>
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <Clock size={16} className="text-gray-500" />
                </div>
              </div>
            </div>
            
            {/* 상담 대상자 검색 영역 */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">상담대상자</label>
              
              {/* 선택된 상담 대상자가 있으면 표시 */}
              {selectedClient ? (
                <div className="w-full p-3 border rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{selectedClient.name}</span>
                    <span className="text-gray-500 text-sm">#{selectedClient.id}</span>
                    {selectedClient.age && <span className="text-gray-500 text-sm">{selectedClient.age}세</span>}
                  </div>
                  <button
                    onClick={handleRemoveSelectedClient}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <>
                  {/* 검색 입력 필드 */}
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="이름 또는 코드로 검색"
                      className="w-full p-2 border rounded-md pr-10"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Search size={18} className="text-gray-400" />
                    </div>
                  </div>
                  
                  {/* 검색 결과 목록 */}
                  {searchResults.length > 0 && (
                    <div className="w-full border rounded-md max-h-48 overflow-y-auto shadow-md z-40 mt-1">
                      {searchResults.map((client) => (
                        <div
                          key={client.id}
                          className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                          onClick={() => handleSelectClient(client)}
                        >
                          <div className="flex items-center gap-2">
                            <span>{client.name}</span>
                            {client.age && <span className="text-gray-500 text-sm">{client.age}세</span>}
                          </div>
                          <span className="text-gray-500 text-sm">#{client.id}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* 제출 버튼 */}
            <div className="mt-auto pt-4">
              <Button
                variant="primary"
                onClick={handleSubmit}
                className="px-6 py-3 w-full"
              >
                상담 일정 추가하기
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  ); 
}