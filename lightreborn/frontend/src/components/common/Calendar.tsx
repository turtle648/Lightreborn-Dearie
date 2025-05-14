"use client"

import React from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

// 타입 정의
export interface Consultation {
  id: string
  clientId: string
  clientName: string
  clientAge?: number
  clientGender?: string
  title: string
  type: string
  date: Date
  time: string
  status: "진행전" | "완료" | "미작성"
  notes?: string
}

interface ConsultationCalendarProps {
  consultations: Consultation[]
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export default function ConsultationCalendar({
  consultations,
  selectedDate,
  onDateChange
}: ConsultationCalendarProps) {
  // 날짜에 일정이 있는지 확인하는 함수
  const hasTileConsultation = (date: Date): boolean => {
    return consultations.some(consultation => 
      consultation.date.getFullYear() === date.getFullYear() &&
      consultation.date.getMonth() === date.getMonth() &&
      consultation.date.getDate() === date.getDate()
    )
  }

  // 특정 날짜의 상담 개수 가져오기
  const getConsultationCount = (date: Date): number => {
    return consultations.filter(consultation => 
      consultation.date.getFullYear() === date.getFullYear() &&
      consultation.date.getMonth() === date.getMonth() &&
      consultation.date.getDate() === date.getDate()
    ).length
  }

  // 타일 클래스 설정 함수
  const tileClassName = ({ date, view }: { date: Date, view: string }): string => {
    if (view === 'month') {
      // 선택된 날짜인 경우
      if (
        selectedDate.getFullYear() === date.getFullYear() &&
        selectedDate.getMonth() === date.getMonth() &&
        selectedDate.getDate() === date.getDate()
      ) {
        return 'selected-date'
      }
      
      // 일정이 있는 경우
      if (hasTileConsultation(date)) {
        return 'has-consultation'
      }
    }
    return ''
  }

  // 타일 내용 설정 함수
  const tileContent = ({ date, view }: { date: Date, view: string }) => {
    if (view === 'month' && hasTileConsultation(date)) {
      const consultationCount = getConsultationCount(date)
      const maxDotsToShow = 3 // 최대 표시할 점의 수
      
      // 날짜별 일정 가져오기
      const dateConsultations = consultations.filter(consultation => 
        consultation.date.getFullYear() === date.getFullYear() &&
        consultation.date.getMonth() === date.getMonth() &&
        consultation.date.getDate() === date.getDate()
      ).slice(0, maxDotsToShow) // 최대 3개만 표시
      
      return (
        <div className="consultation-marker">
          <div className="dot-container">
            {dateConsultations.map((consultation, index) => (
              <div 
                key={`${consultation.id}-${index}`} 
                className={`dot ${
                  consultation.status === '진행전' ? 'dot-green' : 
                  consultation.status === '완료' ? 'dot-blue' : 
                  'dot-red'
                }`}
              />
            ))}
          </div>
          {consultationCount > maxDotsToShow && (
            <div className="text-xs text-gray-500 mt-1">+{consultationCount - maxDotsToShow}</div>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className='w-full h-full'>
      <style jsx global>{`
        /* 달력 기본 스타일 오버라이드 */
        .react-calendar {
          width: 100%;
          height: 100%;
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
        
        /* 달력 타일 (날짜) */
        .react-calendar__tile {
          padding: 1rem 0.5rem;
          position: relative;
          height: 100%;
          background: none;
          text-align: center;
          line-height: 1.25;
          font-size: 0.875rem;
          border-radius: 8px;
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
        .react-calendar__tile--active,
        .selected-date {
          background-color: #EBF5FF !important;
          color: #1E40AF !important;
          border: 2px solid #3B82F6 !important;
        }
        
        /* 일정이 있는 날짜 */
        .has-consultation {
          font-weight: 500;
        }
        
        /* 일정 표시 마커 */
        .consultation-marker {
          position: absolute;
          bottom: 10px;
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .dot-container {
          display: flex;
          gap: 3px;
          justify-content: center;
        }
        
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        
        .dot-green {
          background-color: #10B981;
        }
        
        .dot-blue {
          background-color: #3B82F6;
        }
        
        .dot-red {
          background-color: #EF4444;
        }
        
        /* 비활성화된 날짜 */
        .react-calendar__month-view__days__day--neighboringMonth {
          color: #D1D5DB;
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
        calendarType="gregory"
        onChange={(value) => {
          if (value instanceof Date) {
            onDateChange(value)
          }
        }}
        value={selectedDate}
        locale="ko-KR"
        tileClassName={tileClassName}
        tileContent={tileContent}
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
  )
}

// 유틸리티 함수 내보내기 (페이지에서 사용)
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}