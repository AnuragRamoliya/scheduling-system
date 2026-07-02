import { FormEvent, useEffect, useMemo, useState } from "react";
import { Clipboard, Link as LinkIcon, LogOut, Plus, RefreshCw } from "lucide-react";
import { availabilityApi, bookingApi, bookingLinkApi } from "../api/endpoints";
import { apiMessage } from "../api/client";
import { StatusMessage } from "../components/StatusMessage";
import { useAuthStore } from "../store/authStore";
import { useAvailabilityStore } from "../store/availabilityStore";
import type { Booking } from "../types";
import { overlaps, timeLabel, todayIso } from "../utils/time";

export const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const slots = useAvailabilityStore((state) => state.slots);
  const addSlot = useAvailabilityStore((state) => state.addSlot);
  const [form, setForm] = useState({ date: todayIso(), start_time: "09:00", end_time: "10:00" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [link, setLink] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const selectedDateSlots = useMemo(
    () =>
      slots
        .filter((slot) => slot.date === form.date)
        .sort((first, second) => first.start_time.localeCompare(second.start_time)),
    [form.date, slots]
  );

  const loadBookings = async () => {
    setBookingsLoading(true);
    setError("");
    try {
      setBookings(await bookingApi.list());
    } catch (err) {
      setError(apiMessage(err, "Unable to load booked slots"));
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const clientError = useMemo(() => {
    if (!form.date || !form.start_time || !form.end_time) return "All availability fields are required.";
    if (form.date < todayIso()) return "Date cannot be in the past.";
    if (form.start_time >= form.end_time) return "Start time must be before end time.";
    const conflictingSlot = slots.find(
      (slot) => slot.date === form.date && overlaps(form.start_time, form.end_time, slot.start_time, slot.end_time)
    );
    return conflictingSlot 
      ? `This slot overlaps with existing slot ${timeLabel(conflictingSlot.start_time)}-${timeLabel(conflictingSlot.end_time)} on this date.` 
      : "";
  }, [form, slots]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (clientError) {
      setError(clientError);
      return;
    }
    setSaving(true);
    try {
      const slot = await availabilityApi.create(form);
      addSlot(slot);
      setMessage("Availability saved.");
    } catch (err) {
      setError(apiMessage(err, "Unable to save availability"));
    } finally {
      setSaving(false);
    }
  };

  const generate = async () => {
    setError("");
    setMessage("");
    try {
      const nextLink = await bookingLinkApi.generate();
      const url = `${window.location.origin}/book/${nextLink.token}`;
      setLink(url);
      setMessage("Booking link ready.");
    } catch (err) {
      setError(apiMessage(err, "Unable to generate link"));
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setMessage("Copied to clipboard.");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-ink">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-slate-600">{user?.name} · {user?.timezone}</p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,420px)_1fr]">
        <div className="space-y-6">
          <form onSubmit={save} className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Add Availability</h2>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="date">Date</label>
              <input id="date" type="date" min={todayIso()} value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-moss focus:outline-none focus:ring-2 focus:ring-moss/20" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="start">Start</label>
                <input id="start" type="time" value={form.start_time} onChange={(event) => setForm((current) => ({ ...current, start_time: event.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-moss focus:outline-none focus:ring-2 focus:ring-moss/20" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="end">End</label>
                <input id="end" type="time" value={form.end_time} onChange={(event) => setForm((current) => ({ ...current, end_time: event.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-moss focus:outline-none focus:ring-2 focus:ring-moss/20" />
              </div>
            </div>
            {clientError ? <p className="text-sm text-coral">{clientError}</p> : null}
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-moss px-4 py-2 font-medium text-white hover:bg-moss/90 disabled:opacity-60" disabled={saving}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              {saving ? "Saving..." : "Save"}
            </button>
          </form>

          <div className="space-y-3 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Share Link</h2>
            <button onClick={generate} className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-moss px-4 py-2 font-medium text-moss hover:bg-moss/10">
              <LinkIcon className="h-4 w-4" aria-hidden="true" />
              Generate Link
            </button>
            {link ? (
              <div className="flex gap-2">
                <input readOnly value={link} className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm" aria-label="Generated booking link" />
                <button onClick={copy} className="rounded-md bg-ink px-3 text-white" aria-label="Copy booking link">
                  <Clipboard className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ) : null}
          </div>

          {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
          {message ? <StatusMessage tone="success">{message}</StatusMessage> : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Visible Availability</h2>
            <p className="mt-1 text-sm text-slate-600">
              Showing slots saved during this session for {form.date}.
            </p>
            <div className="mt-4 space-y-2">
              {selectedDateSlots.length === 0 ? (
                <div className="rounded-md border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                  No slots saved for this date during this session.
                </div>
              ) : (
                <div className="grid gap-2">
                  <div className="hidden sm:grid grid-cols-3 gap-3 rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
                    <span>Date</span>
                    <span>Time</span>
                    <span>Duration</span>
                  </div>
                  {selectedDateSlots.map((slot) => {
                    const startHour = parseInt(slot.start_time.split(':')[0]);
                    const startMin = parseInt(slot.start_time.split(':')[1]);
                    const endHour = parseInt(slot.end_time.split(':')[0]);
                    const endMin = parseInt(slot.end_time.split(':')[1]);
                    const durationMin = (endHour * 60 + endMin) - (startHour * 60 + startMin);
                    const durationHr = Math.floor(durationMin / 60);
                    const durationMins = durationMin % 60;
                    
                    return (
                      <div key={slot.id} className="grid sm:grid-cols-3 gap-3 rounded-md border border-moss/30 bg-moss/5 px-3 py-2 items-center">
                        <span className="text-sm font-medium text-slate-900">{slot.date}</span>
                        <span className="text-sm text-moss font-semibold">{timeLabel(slot.start_time)}-{timeLabel(slot.end_time)}</span>
                        <span className="text-xs text-slate-600">{durationHr}h {durationMins}m</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Booked Slots</h2>
                <p className="mt-1 text-sm text-slate-600">Confirmed bookings from your public link.</p>
              </div>
              <button
                onClick={loadBookings}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100 disabled:opacity-60"
                disabled={bookingsLoading}
              >
                <RefreshCw className={`h-4 w-4 ${bookingsLoading ? "animate-spin" : ""}`} aria-hidden="true" />
                Refresh
              </button>
            </div>
            <div className="mt-4 overflow-x-auto">
              {bookingsLoading && bookings.length === 0 ? (
                <div className="rounded-md border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">Loading booked slots...</div>
              ) : bookings.length === 0 ? (
                <div className="rounded-md border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">No confirmed bookings yet.</div>
              ) : (
                <table className="w-full min-w-[620px] border-separate border-spacing-0 text-left text-sm">
                  <thead>
                    <tr className="text-slate-500">
                      <th className="border-b border-slate-200 px-3 py-2 font-medium">Date</th>
                      <th className="border-b border-slate-200 px-3 py-2 font-medium">Time</th>
                      <th className="border-b border-slate-200 px-3 py-2 font-medium">Name</th>
                      <th className="border-b border-slate-200 px-3 py-2 font-medium">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="border-b border-slate-100 px-3 py-3 font-medium">{booking.date}</td>
                        <td className="border-b border-slate-100 px-3 py-3 text-slate-700">
                          {timeLabel(booking.start_time)}-{timeLabel(booking.end_time)}
                        </td>
                        <td className="border-b border-slate-100 px-3 py-3 text-slate-700">{booking.visitor_name}</td>
                        <td className="border-b border-slate-100 px-3 py-3 text-slate-700">{booking.visitor_email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
