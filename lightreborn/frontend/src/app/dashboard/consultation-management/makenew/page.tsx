'use client'

import { useState, useEffect } from "react"; 
import Button from "@/components/common/Button"; 
import { Card } from "@/components/common/Card"; 
import { Calendar as CalendarIcon, Search, X, Clock } from "lucide-react"; 
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

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
        /* 달력 기본 스타일 오버라이드 */
        .react-calendar {
          width: 100%;
          border: none;
          font-family: inherit;
          background-color: transparent;
        }
        
        /* 달력 상단 네비게이션 */
        .react-calendar__navigation {
          margin-bottom: 1.5rem;
        }
        
        .react-calendar__navigation button {
          min-width: 44px;
          height: 44px;
          font-size: 1rem;
          color: #374151;
          background: none;
          border-radius: 8px;
        }
        
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: #F3F4F6;
        }
        
        .react-calendar__navigation__label {
          font-weight: 600;
          font-size: 1.125rem;
        }
        
        /* 요일 헤더 */
        .react-calendar__month-view__weekdays {
          text-align: center;
          margin-bottom: 0.5rem;
        }
        
        .react-calendar__month-view__weekdays__weekday {
          padding: 0.75rem;
          font-weight: 500;
          font-size: 0.875rem;
          color: #6B7280;
          text-transform: uppercase;
        }
        
        .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
          cursor: default;
        }
        
        /* 일요일 제목 스타일 */
        .react-calendar__month-view__weekdays__weekday:first-child abbr {
          color: #EF4444;
        }
        
        /* 토요일 제목 스타일 */
        .react-calendar__month-view__weekdays__weekday:last-child abbr {
          color: #3B82F6;
        }

        /* 달력 타일 (날짜) */
        .react-calendar__tile {
          padding: 1rem 0.5rem;
          position: relative;
          background: none;
          text-align: center;
          line-height: 1.25;
          font-size: 0.875rem;
        }
        
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #F3F4F6;
        }
        
        /* 오늘 날짜 */
        .react-calendar__tile--now {
          background-color: #FEFCE8;
          color: #854D0E;
        }
        
        /* 활성화된 날짜 (선택됨) */
        .react-calendar__tile--active {
          background-color: #EBF5FF !important;
          color: #1E40AF !important;
          border: 2px solid #3B82F6 !important;
        }
        
        /* 비활성화된 날짜 */
        .react-calendar__month-view__days__day--neighboringMonth {
          color: #D1D5DB !important;
        } 

        /* 일요일 날짜 색상 */
        .react-calendar__month-view__days__day:nth-child(7n+1) {
          color: #EF4444;
        }
        
        /* 토요일 날짜 색상 */
        .react-calendar__month-view__days__day:nth-child(7n) {
          color: #3B82F6;
        }
        
        /* 모바일 최적화 */
        @media (max-width: 640px) {
          .react-calendar__tile {
            height: 4rem;
            padding: 0.5rem 0.25rem;
          }
          
          .react-calendar__navigation__label {
            font-size: 1rem;
          }
        }
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

interface SearchResult {
  id: string;
  name: string;
  gender: string;
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
   
  // 더미 데이터 (실제로는 API 호출로 대체) 
  const dummyClients = [ 
    { id: "0137", name: "이OO", gender: "남" }, 
    { id: "0113", name: "김OO", gender: "여" }, 
    { id: "0093", name: "최OO", gender: "남" }, 
  ]; 

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
  useEffect(() => { 
    if (searchTerm.trim() === "") { 
      setSearchResults([]); 
      return; 
    } 
       
    const filteredResults = dummyClients.filter( 
      (client: { id: string; name: string; gender: string }) =>  
        client.name.includes(searchTerm) 
        || client.id.includes(searchTerm) 
    ); 
       
    setSearchResults(filteredResults); 
  }, [searchTerm]); 
   
  // 상담 대상자 선택 함수 
  const handleSelectClient = (client: { id: string; name: string; gender: string }) => { 
    setSelectedClient(client); 
    setSearchTerm(""); 
    setSearchResults([]); 
  }; 
   
  // 선택한 상담 대상자 제거 함수 
  const handleRemoveSelectedClient = () => { 
    setSelectedClient(null); 
  }; 
   
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
       
    // 여기서 API 호출 등 데이터 처리 
    console.log({ 
      type: consultationType, 
      date: format(consultationDate, 'yyyy-MM-dd'),
      time: consultationTime,
      client: selectedClient 
    }); 
       
    // 성공 메시지 또는 리다이렉트 등의 처리 
    alert("상담 일정이 추가되었습니다."); 
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
                    <div className={`flex items-center justify-center w-6 h-6 rounded text-white text-xs ${selectedClient.gender === "남" ? "bg-blue-500" : "bg-pink-500"}`}>
                      {selectedClient.gender}
                    </div>
                    <span className="font-medium">{selectedClient.name}</span>
                    <span className="text-gray-500 text-sm">#{selectedClient.id}</span>
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
                      {searchResults.map((client: { id: string; name: string; gender: string }) => (
                        <div
                          key={client.id}
                          className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                          onClick={() => handleSelectClient(client)}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`flex items-center justify-center w-6 h-6 rounded text-white text-xs ${client.gender === "남" ? "bg-blue-500" : "bg-pink-500"}`}>
                              {client.gender}
                            </div>
                            <span>{client.name}</span>
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