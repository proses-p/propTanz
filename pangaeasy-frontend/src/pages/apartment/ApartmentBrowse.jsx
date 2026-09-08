import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiCalendar, FiCheck, FiChevronLeft, FiChevronRight, FiHome, FiMapPin, FiSearch, FiX, FiZoomIn, FiZoomOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apartmentService from "../../services/apartmentService";
import { BASE_DOMAIN } from "../../services/api";

const mediaUrl = (path) => path?.startsWith("http") ? path : `${BASE_DOMAIN}/storage/${path}`;

const getImages = (apartment) => (apartment.images || []).flatMap((item) => [1, 2, 3, 4, 5]
    .map((number) => item[`image_${number}`] || item[`image_${number}_url`])
    .filter(Boolean)
    .map(mediaUrl));

export default function ApartmentBrowse() {
    const navigate = useNavigate();
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedApartment, setSelectedApartment] = useState(null);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
    const [photoZoom, setPhotoZoom] = useState(1);
    const [bookingApartment, setBookingApartment] = useState(null);
    const [bookingData, setBookingData] = useState({ moveInDate: "", message: "" });
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const loadApartments = async () => {
            try {
                const response = await apartmentService.getAll();
                setApartments(response.data.data?.data || []);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to load apartments.");
            } finally {
                setLoading(false);
            }
        };
        loadApartments();
    }, []);

    useEffect(() => {
        const loadBookings = async () => {
            try {
                const response = await apartmentService.getBookings();
                setBookings(response.data.data || []);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to load your bookings.");
            }
        };
        loadBookings();
    }, []);

    useEffect(() => {
        const closeOnEscape = (event) => {
            if (event.key === "Escape") {
                setSelectedApartment(null);
                setBookingApartment(null);
            }
        };
        document.addEventListener("keydown", closeOnEscape);
        return () => document.removeEventListener("keydown", closeOnEscape);
    }, []);

    const filteredApartments = useMemo(() => apartments.filter((apartment) => {
        const query = search.toLowerCase();
        return [apartment.name, apartment.street, apartment.town, apartment.address]
            .some((value) => value?.toLowerCase().includes(query));
    }), [apartments, search]);

    const hasBooking = (apartmentId) => bookings.some((booking) => booking.apartment_id === apartmentId);

    const openApartment = (apartment) => {
        setSelectedApartment(apartment);
        setSelectedPhotoIndex(0);
        setPhotoZoom(1);
    };

    const submitBooking = async (event) => {
        event.preventDefault();
        try {
            const response = await apartmentService.createBooking({
                apartment_id: bookingApartment.id,
                move_in_date: bookingData.moveInDate,
                message: bookingData.message,
            });
            setBookings((current) => [response.data.data, ...current.filter((item) => item.apartment_id !== bookingApartment.id)]);
            setBookingApartment(null);
            setBookingData({ moveInDate: "", message: "" });
            toast.success("Booking request sent successfully.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send booking request.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900 sm:px-8 lg:py-12">
            <div className="mx-auto max-w-7xl">
                <button type="button" onClick={() => navigate("/dashboard")} className="mb-6 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"><FiArrowLeft /> Back to dashboard</button>
                <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-600">Find your next home</p>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Available apartments</h1>
                        <p className="mt-2 text-slate-500">View apartment details and send a booking request.</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm"><FiHome className="text-emerald-600" /> {apartments.length} listings</div>
                </header>

                <div className="mb-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <FiSearch className="text-slate-400" />
                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by apartment or location" className="w-full outline-none" />
                </div>

                {loading ? <div className="rounded-2xl bg-white p-12 text-center text-slate-500 shadow-sm">Loading apartments...</div> : filteredApartments.length ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredApartments.map((apartment) => {
                            const images = getImages(apartment);
                            return <article key={apartment.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                                <button type="button" onClick={() => openApartment(apartment)} className="relative block h-52 w-full bg-slate-100 text-left">
                                    {images[0] ? <img src={images[0]} alt={apartment.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-slate-400"><FiHome size={38} /></div>}
                                    {images.length > 1 && <span className="absolute bottom-3 right-3 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold text-white">{images.length} photos</span>}
                                </button>
                                <div className="p-5">
                                    <h2 className="text-xl font-bold">{apartment.name}</h2>
                                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-500"><FiMapPin className="text-emerald-600" /> {apartment.street}, {apartment.town}</p>
                                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{apartment.description}</p>
                                    <div className="mt-5 flex gap-3">
                                        <button type="button" onClick={() => openApartment(apartment)} className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">View details</button>
                                        <button type="button" onClick={() => setBookingApartment(apartment)} disabled={hasBooking(apartment.id)} className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300">{hasBooking(apartment.id) ? "Requested" : "Book now"}</button>
                                    </div>
                                </div>
                            </article>;
                        })}
                    </div>
                ) : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm"><h2 className="text-xl font-bold">No apartments found</h2><p className="mt-2 text-slate-500">Try another search.</p></div>}
            </div>

            {selectedApartment && <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 p-5" onMouseDown={(event) => event.target === event.currentTarget && setSelectedApartment(null)}>
                <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                    <div className="relative h-64 overflow-hidden bg-slate-100">
                        {getImages(selectedApartment)[selectedPhotoIndex] ? <img src={getImages(selectedApartment)[selectedPhotoIndex]} alt={`${selectedApartment.name} photo ${selectedPhotoIndex + 1}`} className="h-full w-full object-contain transition-transform duration-200" style={{ transform: `scale(${photoZoom})` }} /> : <div className="flex h-full items-center justify-center text-slate-400"><FiHome size={42} /></div>}
                        {getImages(selectedApartment).length > 1 && <><button type="button" onClick={() => { setSelectedPhotoIndex((index) => (index - 1 + getImages(selectedApartment).length) % getImages(selectedApartment).length); setPhotoZoom(1); }} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700" title="Previous photo"><FiChevronLeft /></button><button type="button" onClick={() => { setSelectedPhotoIndex((index) => (index + 1) % getImages(selectedApartment).length); setPhotoZoom(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700" title="Next photo"><FiChevronRight /></button></>}
                        <button type="button" onClick={() => setSelectedApartment(null)} className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-slate-700" title="Close details"><FiX /></button>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-3">
                        <div className="flex gap-2 overflow-x-auto">{getImages(selectedApartment).map((image, index) => <button type="button" key={image} onClick={() => { setSelectedPhotoIndex(index); setPhotoZoom(1); }} className={`h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${index === selectedPhotoIndex ? "border-emerald-600" : "border-transparent"}`} title={`View photo ${index + 1}`}><img src={image} alt="" className="h-full w-full object-cover" /></button>)}</div>
                        <div className="flex shrink-0 gap-1"><button type="button" onClick={() => setPhotoZoom((value) => Math.max(1, value - 0.25))} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" title="Zoom out"><FiZoomOut /></button><button type="button" onClick={() => setPhotoZoom((value) => Math.min(3, value + 0.25))} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" title="Zoom in"><FiZoomIn /></button></div>
                    </div>
                    <div className="p-6"><h2 className="text-2xl font-bold">{selectedApartment.name}</h2><p className="mt-2 flex items-center gap-2 text-slate-500"><FiMapPin className="text-emerald-600" /> {selectedApartment.address}</p><p className="mt-5 leading-7 text-slate-600">{selectedApartment.description}</p><button type="button" onClick={() => { setSelectedApartment(null); setBookingApartment(selectedApartment); }} disabled={hasBooking(selectedApartment.id)} className="mt-6 w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:bg-slate-300">{hasBooking(selectedApartment.id) ? "Booking requested" : "Book this apartment"}</button></div>
                </div>
            </div>}

            {bookingApartment && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-5" onMouseDown={(event) => event.target === event.currentTarget && setBookingApartment(null)}><form onSubmit={submitBooking} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-6 flex items-start justify-between"><div><p className="text-sm font-semibold text-emerald-600">Booking request</p><h2 className="mt-1 text-2xl font-bold">{bookingApartment.name}</h2></div><button type="button" onClick={() => setBookingApartment(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" title="Close booking form"><FiX /></button></div><label className="block text-sm font-semibold text-slate-700">Preferred move-in date<input type="date" required value={bookingData.moveInDate} onChange={(event) => setBookingData({ ...bookingData, moveInDate: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 outline-none focus:border-emerald-500" /></label><label className="mt-4 block text-sm font-semibold text-slate-700">Message <span className="font-normal text-slate-400">(optional)</span><textarea value={bookingData.message} onChange={(event) => setBookingData({ ...bookingData, message: event.target.value })} rows="4" placeholder="Tell the owner anything important..." className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-3 py-3 outline-none focus:border-emerald-500" /></label><button type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700"><FiCalendar /> Send booking request</button></form></div>}

            {bookings.length > 0 && <div className="mx-auto mt-8 max-w-7xl rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800"><p className="flex items-center gap-2 font-semibold"><FiCheck /> You have {bookings.length} booking request{bookings.length > 1 ? "s" : ""}.</p></div>}
        </div>
    );
}
