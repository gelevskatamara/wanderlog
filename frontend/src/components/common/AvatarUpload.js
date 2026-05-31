import { useRef, useState } from "react";
import { uploadAvatar, removeAvatar } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import ConfirmModal from "./ConfirmModal";

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'https://wanderlog-production-bfcd.up.railway.app';

export default function AvatarUpload() {
  const { user, setUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await uploadAvatar(formData);
      setUser(res.data.user);
      localStorage.setItem("wl_user", JSON.stringify(res.data.user));
    } catch (err) {
      setUploadError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      fileRef.current.value = "";
    }
  };

  const handleRemove = () => setConfirmRemove(true);

  const handleConfirmRemove = async () => {
    try {
      await removeAvatar();
      const updated = { ...user, avatar: "" };
      setUser(updated);
      localStorage.setItem("wl_user", JSON.stringify(updated));
      setConfirmRemove(false);
    } catch {
      setConfirmRemove(false);
    }
  };

  const avatarUrl = user?.avatar ? `${API_BASE}${user.avatar}` : null;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar preview */}
      <div className="relative group">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-soft-pink to-soft-purple flex items-center justify-center text-white text-3xl font-black shadow-lg">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            user?.name?.[0]?.toUpperCase()
          )}
        </div>
        {/* Upload overlay on hover */}
        <label className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <span className="text-white text-xs font-semibold text-center leading-tight px-2">
            {uploading ? "..." : "Change"}
          </span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <label className="text-xs text-primary font-semibold hover:underline cursor-pointer">
          {uploading ? "Uploading..." : "Upload photo"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
        {avatarUrl && (
          <>
            <span className="text-slate-300 text-xs">·</span>
            <button
              onClick={handleRemove}
              className="text-xs text-red-400 font-semibold hover:underline"
            >
              Remove
            </button>
          </>
        )}
      </div>
      <p className="text-xs text-slate-400">JPG, PNG or WebP · Max 5MB</p>
    <ConfirmModal
      isOpen={confirmRemove}
      onClose={() => setConfirmRemove(false)}
      onConfirm={handleConfirmRemove}
      title="Remove Avatar?"
      message="This will remove your profile photo. You can upload a new one at any time."
      confirmText="Remove"
      confirmVariant="danger"
    />
    </div>
  );
}
