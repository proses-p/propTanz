import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiDownload, FiEdit2, FiEye, FiMaximize2, FiTrash2, FiX, FiZoomIn, FiZoomOut } from "react-icons/fi";
import { BASE_DOMAIN } from "../../services/api";

const mediaUrl = (path) => path?.startsWith("http") ? path : `${BASE_DOMAIN}/storage/${path}`;

const apartmentImages = (apartment) => (apartment.images || []).flatMap((item) => [1, 2, 3, 4, 5]
    .map((number) => item[`image_${number}`] || item[`image_${number}_url`])
    .filter(Boolean)
    .map((path) => mediaUrl(path)));

export default function ApartmentTable({ apartments, onView, onEdit, onDelete }) {
    const [gallery, setGallery] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [zoom, setZoom] = useState(1);

    const openGallery = (apartment, index = 0) => {
        const images = apartmentImages(apartment);
        if (!images.length) return;
        setGallery({ name: apartment.name, images });
        setActiveIndex(index);
        setZoom(1);
    };

    const closeGallery = () => setGallery(null);

    useEffect(() => {
        if (!gallery) return undefined;
        const handleKeyDown = (event) => {
            if (event.key === "Escape") closeGallery();
            if (event.key === "ArrowRight") setActiveIndex((index) => (index + 1) % gallery.images.length);
            if (event.key === "ArrowLeft") setActiveIndex((index) => (index - 1 + gallery.images.length) % gallery.images.length);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gallery]);

    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full">
                <thead className="bg-slate-50">
                    <tr>
                        {['Photo', 'Name', 'Location', 'Description', 'Actions'].map((heading) => (
                            <th key={heading} className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                {heading}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {apartments.map((apartment) => (
                        <tr key={apartment.id} className="border-t border-slate-100 hover:bg-slate-50">
                            <td className="px-5 py-4">
                                {apartmentImages(apartment).length ? (
                                    <button type="button" onClick={() => openGallery(apartment)} className="group relative block h-16 w-24 overflow-hidden rounded-xl bg-slate-100" title="View apartment photos">
                                        <img src={apartmentImages(apartment)[0]} alt={apartment.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-110" />
                                        <span className="absolute inset-0 flex items-center justify-center bg-slate-950/35 text-white opacity-0 transition group-hover:opacity-100"><FiMaximize2 /></span>
                                    </button>
                                ) : <div className="flex h-16 w-24 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400">No photo</div>}
                            </td>
                            <td className="px-5 py-4 font-semibold text-slate-900">{apartment.name}</td>
                            <td className="px-5 py-4 text-sm text-slate-600">{apartment.street}, {apartment.town}</td>
                            <td className="max-w-sm px-5 py-4 text-sm text-slate-600">{apartment.description}</td>
                            <td className="px-5 py-4">
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => onView(apartment)} title="View apartment" className="rounded-lg p-2 text-slate-600 hover:bg-slate-200"><FiEye /></button>
                                    <button type="button" onClick={() => onEdit(apartment)} title="Edit apartment" className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"><FiEdit2 /></button>
                                    <button type="button" onClick={() => onDelete(apartment)} title="Delete apartment" className="rounded-lg p-2 text-red-600 hover:bg-red-50"><FiTrash2 /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {gallery && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 sm:p-8" role="dialog" aria-modal="true" aria-label={`${gallery.name} photos`} onClick={closeGallery}>
                    <div className="flex max-h-full w-full max-w-6xl flex-col gap-4" onClick={(event) => event.stopPropagation()}>
                        <div className="flex items-center justify-between text-white">
                            <div>
                                <p className="font-semibold">{gallery.name}</p>
                                <p className="text-sm text-slate-300">{activeIndex + 1} / {gallery.images.length}</p>
                            </div>
                            <button type="button" onClick={closeGallery} className="rounded-full p-3 text-white hover:bg-white/15" title="Close gallery" aria-label="Close gallery"><FiX size={22} /></button>
                        </div>
                        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-black/30">
                            <img src={gallery.images[activeIndex]} alt={`${gallery.name} ${activeIndex + 1}`} className="max-h-[65vh] max-w-full object-contain transition-transform duration-200" style={{ transform: `scale(${zoom})` }} />
                            {gallery.images.length > 1 && <>
                                <button type="button" onClick={() => setActiveIndex((index) => (index - 1 + gallery.images.length) % gallery.images.length)} className="absolute left-3 rounded-full bg-white/90 p-3 text-slate-900 shadow-lg hover:bg-white" title="Previous photo" aria-label="Previous photo"><FiChevronLeft size={22} /></button>
                                <button type="button" onClick={() => setActiveIndex((index) => (index + 1) % gallery.images.length)} className="absolute right-3 rounded-full bg-white/90 p-3 text-slate-900 shadow-lg hover:bg-white" title="Next photo" aria-label="Next photo"><FiChevronRight size={22} /></button>
                            </>}
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {gallery.images.map((image, index) => <button type="button" key={image} onClick={() => { setActiveIndex(index); setZoom(1); }} className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${index === activeIndex ? "border-white" : "border-transparent opacity-60 hover:opacity-100"}`} title={`View photo ${index + 1}`}><img src={image} alt="" className="h-full w-full object-cover" /></button>)}
                            </div>
                            <div className="flex items-center gap-2 text-white">
                                <button type="button" onClick={() => setZoom((value) => Math.max(1, value - 0.25))} className="rounded-lg bg-white/15 p-3 hover:bg-white/25" title="Zoom out" aria-label="Zoom out"><FiZoomOut /></button>
                                <button type="button" onClick={() => setZoom(1)} className="min-w-14 rounded-lg bg-white/15 px-3 py-2 text-sm hover:bg-white/25" title="Reset zoom">{Math.round(zoom * 100)}%</button>
                                <button type="button" onClick={() => setZoom((value) => Math.min(3, value + 0.25))} className="rounded-lg bg-white/15 p-3 hover:bg-white/25" title="Zoom in" aria-label="Zoom in"><FiZoomIn /></button>
                                <a href={gallery.images[activeIndex]} download target="_blank" rel="noreferrer" className="rounded-lg bg-blue-600 p-3 hover:bg-blue-500" title="Download photo" aria-label="Download photo"><FiDownload /></a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

