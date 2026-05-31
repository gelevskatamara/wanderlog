import { useState, useEffect, useRef } from "react";
import { getTripPhotos, uploadTripPhoto, deleteTripPhoto } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import ConfirmModal from "./ConfirmModal";
import { DeleteIcon } from "./Icons";

const API_BASE = process.env.REACT_APP_API_URL?.replace("/api", "") || "https://wanderlog-production-bfcd.up.railway.app";

export default function TripGallery({ trip }) {
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [confirmPhoto, setConfirmPhoto] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [caption, setCaption] = useState("");
  const fileRef = useRef();

  const canUpload =
    user &&
    user.role !== "guest" &&
    (trip.userId?._id === user._id ||
      trip.userId === user._id ||
      user.role === "admin");

  const load = () => {
    getTripPhotos(trip._id)
      .then((res) => setPhotos(res.data.photos))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [trip._id]);

  // Add this useEffect after the existing ones
  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightbox]);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("photos", file));
      formData.append("caption", caption);
      await uploadTripPhoto(trip._id, formData);
      setCaption("");
      load();
    } catch (err) {
      setUploadError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      fileRef.current.value = "";
    }
  };

  const handleDelete = (photoId) => setConfirmPhoto(photoId);

  const handleConfirmDelete = async () => {
    try { await deleteTripPhoto(confirmPhoto); setConfirmPhoto(null); load(); }
    catch { setConfirmPhoto(null); }
  };

  return (
    <div className="card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm sm:text-base font-bold text-slate-800">
          Gallery
          {photos.length > 0 && (
            <span className="ml-2 text-xs text-slate-400 font-normal">
              ({photos.length} photo{photos.length !== 1 ? "s" : ""})
            </span>
          )}
        </h3>
        {canUpload && (
          <label className="cursor-pointer text-xs text-primary font-semibold hover:underline flex items-center gap-1">
            {uploading ? "Uploading..." : "+ Add Photos"}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="spinner" />
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-10 text-slate-400">
          <div className="flex flex-col justify-center items-center mb-3">
            <svg className="size-5 md:size-9" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.4" d="M3.99798 20H15.518C18.278 20 19.378 18.31 19.508 16.25V7.99C19.648 5.83 17.928 4 15.758 4C15.148 4 14.588 3.65 14.308 3.11L13.588 1.66C13.128 0.75 11.928 0 10.908 0H8.61799C7.58799 0 6.38798 0.75 5.92798 1.66L5.20798 3.11C4.92798 3.65 4.36798 4 3.75798 4C1.58798 4 -0.13202 5.83 0.00798004 7.99L0.00798004 16.25C0.12798 18.31 1.23798 20 3.99798 20Z" fill="#636bab"/>
              <path d="M11.2578 6.75H8.25781C7.84781 6.75 7.50781 6.41 7.50781 6C7.50781 5.59 7.84781 5.25 8.25781 5.25H11.2578C11.6678 5.25 12.0078 5.59 12.0078 6C12.0078 6.41 11.6678 6.75 11.2578 6.75Z" fill="#636bab"/>
              <path d="M9.75891 16.1311C11.6256 16.1311 13.1389 14.6178 13.1389 12.7511C13.1389 10.8844 11.6256 9.37109 9.75891 9.37109C7.89218 9.37109 6.37891 10.8844 6.37891 12.7511C6.37891 14.6178 7.89218 16.1311 9.75891 16.1311Z" fill="#636bab"/>
            </svg>
          </div>
          <p className="text-sm">No photos yet.</p>
          {canUpload && (
            <label className="mt-3 inline-block cursor-pointer text-xs text-primary font-semibold hover:underline">
              Upload the first photo
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {photos.map((p) => (
            <div
              key={p._id}
              className="relative group w-[calc(33.333%-6px)] sm:w-[calc(25%-6px)] aspect-square rounded-xl overflow-hidden bg-slate-100 cursor-pointer"
              onClick={() => setLightbox(p)}
            >
              <img
                src={`${API_BASE}${p.url}`}
                alt={p.caption || "Trip photo"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Delete button */}
              {canUpload && (
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmPhoto(p._id); }}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                >
                  <DeleteIcon className="w-3 h-3" />
                </button>
              )}
              {/* Caption on hover */}
              {p.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-2 py-1 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                  {p.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {uploadError && (
        <div className="mt-2">
          <Alert type="error" message={uploadError} />
        </div>
      )}
      <ConfirmModal
        isOpen={!!confirmPhoto}
        onClose={() => setConfirmPhoto(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Photo?"
        message="This will permanently delete this photo. This cannot be undone."
        confirmText="Delete"
      />
      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={`${API_BASE}${lightbox.url}`}
              alt={lightbox.caption || "Trip photo"}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            {lightbox.caption && (
              <p className="text-white text-center mt-3 text-sm">{lightbox.caption}</p>
            )}
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-4 -right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 transition-colors shadow-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
