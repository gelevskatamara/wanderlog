import { useState, useEffect, useRef } from "react";
import { getTripPhotos, uploadTripPhoto, deleteTripPhoto } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { DeleteIcon } from "./Icons";

const API_BASE = process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:5000";

export default function TripGallery({ trip }) {
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [lightbox, setLightbox] = useState(null);
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
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      fileRef.current.value = "";
    }
  };

  const handleDelete = async (photoId) => {
    if (!window.confirm("Delete this photo?")) return;
    try {
      await deleteTripPhoto(photoId);
      load();
    } catch {
      alert("Delete failed");
    }
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
          <div className="text-4xl mb-3">📷</div>
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
                  onClick={(e) => { e.stopPropagation(); handleDelete(p._id); }}
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
