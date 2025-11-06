import { useState, useRef } from "react";
import type { MyUser } from "../../../types/mypage";
import { fetchMyProfile, updateUserProfile } from "../../../api/userService";
import { Camera } from "lucide-react";
import { useUserStore } from "../../../store/useUserStore";

export type EditProfileCardProps = {
  user: MyUser;
  onCancel: () => void;
  onUpdate: (updatedUser: MyUser) => void;
};

const DEFAULT_IMG = "/default_image.png";

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$/;

const EditProfileCard = ({ user, onCancel, onUpdate }: EditProfileCardProps) => {
  const [nickname, setNickname] = useState(user.nickname);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(user.imgUrl ?? DEFAULT_IMG);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [, setDidPickNewImage] = useState(false);

  const isSocial = !!(user as any).socialLogin;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const MAX_SIZE = 8 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        alert("이미지 용량이 너무 큽니다. 8MB 이하의 이미지를 선택해주세요.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setShowImageOptions(false);
      setDidPickNewImage(true);
    }
  };

  const handleResetToDefaultImage = () => {
    setPreviewUrl(DEFAULT_IMG);
    setProfileImage(null);
    setShowImageOptions(false);
    setDidPickNewImage(false);
  };

  const handleCameraClick = () => {
    if (previewUrl === DEFAULT_IMG || user.imgUrl === null) {
      fileInputRef.current?.click();
    } else {
      setShowImageOptions(!showImageOptions);
    }
  };

  const handleSubmit = async () => {
    if (!isSocial && newPassword) {
      if (!PASSWORD_REGEX.test(newPassword)) {
        setNewPasswordError("영문, 숫자, 특수문자를 각각 1자 이상 포함하고 최소 8자여야 합니다.");
        return;
      } else {
        setNewPasswordError("");
      }
      if (newPassword !== confirmPassword) {
        setConfirmPasswordError("새 비밀번호와 확인이 일치하지 않습니다.");
        return;
      } else {
        setConfirmPasswordError("");
      }
    }

    const fd = new FormData();

    const trimmedNick = nickname.trim();
    if (trimmedNick && trimmedNick !== user.nickname) {
      fd.append("nickname", trimmedNick);
    }

    if (!isSocial && newPassword) {
      fd.append("newPassword", newPassword);
    }

    if (profileImage && profileImage.size > 0) {
      fd.append("profileImg", profileImage);
    }

    try {
      await updateUserProfile(fd);
      const refreshed = await fetchMyProfile();

      const prevImg = (user as any)?.imgUrl;
      const incomingImg = (refreshed as any)?.imgUrl;
      const safeImg = incomingImg && String(incomingImg).trim() !== "" ? incomingImg : prevImg ?? incomingImg;

      const next: MyUser = { ...refreshed, imgUrl: safeImg } as MyUser;

      useUserStore.getState().setMyUser({
        ...(next as any),
        artistList: (next as any).artistList ?? [],
      } as any);

      onUpdate(next);

      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      alert("프로필 수정 중 오류가 발생했습니다.");
    }
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewPassword(val);

    if (val && !PASSWORD_REGEX.test(val)) {
      setNewPasswordError("영문, 숫자, 특수문자를 각각 1자 이상 포함하고 최소 8자여야 합니다.");
    } else {
      setNewPasswordError("");
    }

    if (confirmPassword && val !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setConfirmPassword(val);

    if (newPassword && newPassword !== val) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setConfirmPasswordError("");
    }
  };

  return (
    <div className="bg-white rounded-xl px-4 sm:px-8 py-6 mb-10 w-full max-w-[880px] mx-auto shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold">프로필 수정</h1>
        <div className="space-x-2">
          <button className="text-sm text-purple-600 font-medium hover:underline transition" onClick={handleSubmit}>
            저장
          </button>
          <button className="text-sm text-gray-500 font-medium hover:underline" onClick={onCancel}>
            취소
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
        <div className="flex flex-col items-center w-full sm:w-32 shrink-0">
          <div className="relative">
            <img src={previewUrl} alt="프로필 이미지" className="w-24 h-24 rounded-full object-cover" />
            <button onClick={handleCameraClick} className="absolute bottom-0 right-0 bg-purple-600 text-white p-1 rounded-full hover:scale-105 transition">
              <Camera size={18} />
            </button>
          </div>

          {showImageOptions && (
            <div className="mt-2 space-y-1 text-sm">
              <button onClick={handleImageClick} className="text-purple-600 hover:underline">
                변경하기
              </button>
              {user.imgUrl && user.imgUrl !== DEFAULT_IMG && (
                <button onClick={handleResetToDefaultImage} className="text-gray-500 hover:underline">
                  기본 이미지로 변경
                </button>
              )}
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </div>

        <div className="min-w-0 flex-1 text-sm grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-[8rem,1fr] items-center gap-2 sm:gap-3">
            <label className="text-gray-500 font-medium">이메일</label>
            <div className="min-w-0">
              <input value={user.email} readOnly className="w-full rounded-lg border border-gray-200 text-gray-500 bg-gray-50 px-2 py-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[8rem,1fr] items-center gap-2 sm:gap-3">
            <label className="text-gray-500 font-medium">아이디</label>
            <div className="min-w-0">
              <input value={user.userId} readOnly className="w-full rounded-lg border border-gray-200 text-gray-500 bg-gray-50 px-2 py-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[8rem,1fr] items-center gap-2 sm:gap-3">
            <label htmlFor="nickname" className="text-gray-500 font-medium">
              닉네임
            </label>
            <div className="min-w-0">
              <input id="nickname" className="w-full rounded-lg border border-gray-200 px-2 py-1" value={nickname} onChange={(e) => setNickname(e.target.value)} />
            </div>
          </div>

          {!isSocial ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-[8rem,1fr] items-start gap-2 sm:gap-3">
                <label className="text-gray-500 font-medium pt-2">새 비밀번호</label>
                <div className="min-w-0 flex-1">
                  <input type="password" className="w-full rounded-lg border border-gray-200 px-2 py-1" value={newPassword} onChange={handleNewPasswordChange} placeholder="영문/숫자/특수문자 포함, 8자 이상" />
                  {newPasswordError && <p className="text-red-500 text-xs mt-1">{newPasswordError}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[8rem,1fr] items-start gap-2 sm:gap-3">
                <label className="text-gray-500 font-medium pt-2">비밀번호 확인</label>
                <div className="min-w-0 flex-1">
                  <input type="password" className="w-full rounded-lg border border-gray-200 px-2 py-1" value={confirmPassword} onChange={handleConfirmPasswordChange} />
                  {confirmPasswordError && <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>}
                </div>
              </div>
            </>
          ) : (
            <div className="text-xs text-gray-500">소셜 로그인 계정은 여기서 비밀번호를 변경할 수 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfileCard;
