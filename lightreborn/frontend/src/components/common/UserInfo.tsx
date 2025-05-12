import Image, { StaticImageData } from "next/image";
import logo from "@/assets/user.svg";

interface UserInfoProps {
  id: string;
  name: string;
  gender: string;
  age: number;
  profileImage?: StaticImageData;
}

export const UserInfo = ({gender, name, id, age, profileImage}: UserInfoProps) => {
  return (
    <div className="flex items-center">
      <div className="rounded-full w-20 h-20 flex items-center justify-center mr-6">
        <div className="">
          <Image src={profileImage || logo} alt="user" />
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center">
          <span className="bg-blue-400 text-white px-3 py-1 rounded-md mr-2">{gender}</span>
          <span className="text-xl font-bold">{name}</span>
          <span className="text-gray-500 ml-2">{id}</span>
        </div>
        <div className="text-lg">만 {age}세</div>
      </div>
    </div>
  );
};
