"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { signup } from "@/apis/user-api";
import { AxiosError } from "axios";

interface RegisterFormData {
  id: string;
  password: string;
  confirmPassword: string;
  name: string;
  nickName: string;
  gender: "MALE" | "FEMALE" | "";
  birthDate: string;
  phoneNumber: string;
  emergencyContact: string;
}

export function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    id: "",
    password: "",
    confirmPassword: "",
    name: "",
    nickName: "",
    gender: "",
    birthDate: "",
    phoneNumber: "",
    emergencyContact: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterFormData, string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 에러 메시지 초기화
    if (errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleGenderChange = (value: "MALE" | "FEMALE") => {
    setFormData((prev) => ({ ...prev, gender: value }));
    if (errors.gender) {
      setErrors((prev) => ({ ...prev, gender: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};

    // 아이디 검증
    if (!formData.id) {
      newErrors.id = "아이디를 입력해주세요.";
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (formData.password.length < 6) {
      newErrors.password = "비밀번호는 최소 6자 이상이어야 합니다.";
    }

    // 비밀번호 확인 검증
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    // 이름 검증
    if (!formData.name) {
      newErrors.name = "이름을 입력해주세요.";
    }

    // 닉네임 검증
    if (!formData.nickName) {
      newErrors.nickName = "닉네임을 입력해주세요.";
    }

    // 성별 검증
    if (!formData.gender) {
      newErrors.gender = "성별을 선택해주세요.";
    }

    // 생년월일 검증
    if (!formData.birthDate) {
      newErrors.birthDate = "생년월일을 입력해주세요.";
    }

    // 전화번호 검증
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "전화번호를 입력해주세요.";
    } else if (!/^\d{10,11}$/.test(formData.phoneNumber.replace(/-/g, ""))) {
      newErrors.phoneNumber = "유효한 전화번호를 입력해주세요.";
    }

    // 비상 연락처 검증 (선택 사항이므로 입력된 경우에만 검증)
    if (
      formData.emergencyContact &&
      !/^\d{10,11}$/.test(formData.emergencyContact.replace(/-/g, ""))
    ) {
      newErrors.emergencyContact = "유효한 전화번호를 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await signup(formData);
      if (response === 201) {
        router.push(ROUTES.AUTH.LOGIN);
      }
    } catch (err) {
      const axiosError = err as AxiosError;

      const errorData = axiosError.response?.data as {
        fieldErrors?: { field: string; message: string }[];
      };

      if (
        axiosError.response?.status === 400 &&
        Array.isArray(errorData?.fieldErrors)
      ) {
        const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};

        errorData.fieldErrors.forEach(({ field, message }) => {
          if (field in formData) {
            newErrors[field as keyof RegisterFormData] = message;
          }
        });

        setErrors((prev) => ({ ...prev, ...newErrors }));
      } else if (axiosError.response?.status === 409) {
        setErrors((prev) => ({
          ...prev,
          id: "이미 사용 중인 아이디입니다.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          id: "회원가입에 실패했습니다. 다시 시도해주세요.",
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.id && errors.id.includes("회원가입에 실패") && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          {errors.id}
        </div>
      )}

      {/* 아이디 */}
      <div className="space-y-2">
        <Label htmlFor="id" className="text-sm font-medium">
          아이디 <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="id"
            name="id"
            type="text"
            value={formData.id}
            onChange={handleChange}
            placeholder="아이디를 입력하세요"
            className={cn(
              "pl-10",
              errors.id ? "border-red-500 focus-visible:ring-red-500" : ""
            )}
          />
        </div>
        {errors.id && !errors.id.includes("회원가입에 실패") && (
          <p className="text-xs text-red-500">{errors.id}</p>
        )}
      </div>

      {/* 비밀번호 */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          비밀번호 <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
            className={cn(
              "pl-10 pr-10",
              errors.password ? "border-red-500 focus-visible:ring-red-500" : ""
            )}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password}</p>
        )}
        <p className="text-xs text-gray-500">
          비밀번호는 최소 6자 이상이어야 합니다.
        </p>
      </div>

      {/* 비밀번호 확인 */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium">
          비밀번호 확인 <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="비밀번호를 다시 입력하세요"
            className={cn(
              "pl-10",
              errors.confirmPassword
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            )}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      {/* 이름 */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          이름 <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="이름을 입력하세요"
            className={cn(
              "pl-10",
              errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
            )}
          />
        </div>
        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
      </div>

      {/* 닉네임 */}
      <div className="space-y-2">
        <Label htmlFor="nickName" className="text-sm font-medium">
          닉네임 <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="nickName"
            name="nickName"
            type="text"
            value={formData.nickName}
            onChange={handleChange}
            placeholder="닉네임을 입력하세요"
            className={cn(
              "pl-10",
              errors.nickName ? "border-red-500 focus-visible:ring-red-500" : ""
            )}
          />
        </div>
        {errors.nickName && (
          <p className="text-xs text-red-500">{errors.nickName}</p>
        )}
      </div>

      {/* 성별 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          성별 <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={formData.gender}
          onValueChange={(value) =>
            handleGenderChange(value as "MALE" | "FEMALE")
          }
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="MALE" id="male" />
            <Label htmlFor="male" className="cursor-pointer">
              남성
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="FEMALE" id="female" />
            <Label htmlFor="female" className="cursor-pointer">
              여성
            </Label>
          </div>
        </RadioGroup>
        {errors.gender && (
          <p className="text-xs text-red-500">{errors.gender}</p>
        )}
      </div>

      {/* 생년월일 */}
      <div className="space-y-2">
        <Label htmlFor="birthDate" className="text-sm font-medium">
          생년월일 <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
            className={cn(
              "pl-10",
              errors.birthDate
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            )}
          />
        </div>
        {errors.birthDate && (
          <p className="text-xs text-red-500">{errors.birthDate}</p>
        )}
      </div>

      {/* 전화번호 */}
      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="text-sm font-medium">
          전화번호 <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="01012345678"
            className={cn(
              "pl-10",
              errors.phoneNumber
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            )}
          />
        </div>
        {errors.phoneNumber && (
          <p className="text-xs text-red-500">{errors.phoneNumber}</p>
        )}
      </div>

      {/* 비상 연락처 */}
      <div className="space-y-2">
        <Label htmlFor="emergencyContact" className="text-sm font-medium">
          비상 연락처
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="emergencyContact"
            name="emergencyContact"
            type="tel"
            value={formData.emergencyContact}
            onChange={handleChange}
            placeholder="01098765432 (선택사항)"
            className={cn(
              "pl-10",
              errors.emergencyContact
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            )}
          />
        </div>
        {errors.emergencyContact && (
          <p className="text-xs text-red-500">{errors.emergencyContact}</p>
        )}
      </div>

      {/* 이용약관 동의 */}
      <div className="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          required
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <Label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
          <span>이용약관 및 개인정보 처리방침에 동의합니다</span>
        </Label>
      </div>

      {/* 제출 버튼 */}
      <div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isLoading ? "가입 중..." : "회원가입"}
        </Button>
      </div>
    </form>
  );
}
