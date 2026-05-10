
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Check, Home, Users, Minus, Plus, ArrowLeft } from "lucide-react";

function Requirements() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ FIX: SelectServices passes { hourlySelections, flatServices }
  // — not { services, hoursPerDay }. Destructure correctly here.
  const { hourlySelections = {}, flatServices = [] } = location.state || {};

  const [houseSize, setHouseSize] = useState("1BHK");
  const [members, setMembers] = useState(4);

  const HOUSE_SIZES = [
    { id: "1BHK",  desc: "1 bed · 1 bath"  },
    { id: "2BHK",  desc: "2 bed · 1 bath"  },
    { id: "3BHK",  desc: "3 bed · 2 bath"  },
    { id: "4BHK+", desc: "4+ bed · 2+ bath" },
  ];

  const next = () => {
    if (!houseSize || members <= 0) return;

    // ✅ FIX: build the flat services array and hoursPerDay map here
    // so SelectDateTime and AvailableSlots get exactly what they expect.
    //
    // services  → ["BABYSITTING", "COOKING", "CLEANING", ...]
    // hoursPerDay → the hours for the first hourly service selected
    //               (backend accepts one hoursPerDay value for the booking)
    const services = [
      ...Object.keys(hourlySelections),
      ...flatServices,
    ];

    // Use the hours from the first hourly service as hoursPerDay.
    // If only flat services selected, hoursPerDay is null.
    const firstHourlyId = Object.keys(hourlySelections)[0];
    const hoursPerDay = firstHourlyId ? hourlySelections[firstHourlyId] : null;

    navigate("/user/date", {
      state: {
        services,
        hoursPerDay,
        hourlySelections, // keep full map for BookingPreview if needed
        flatServices,
        houseSize,
        members,
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* HERO */}
      <div className="bg-[#1E293B] pt-2 pb-20 md:pt-20 md:pb-24 px-[5%] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[200px] h-[200px] rounded-full bg-blue-400/5 translate-y-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <button
            onClick={() => navigate(-1)}
            className="group mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10 transition-all hover:scale-110 active:scale-95"
          >
            <ArrowLeft size={18} strokeWidth={2.5} className="text-slate-900 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Step 2 of 4</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
            House <span className="text-blue-400">Details</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-3 font-medium max-w-xl leading-relaxed">
            Help us customize your service experience.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
            <span className="text-slate-300 text-xs font-bold">
              {houseSize} · {members} member{members > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="px-[5%] pb-28">
        <div className="max-w-7xl mx-auto -mt-8 md:-mt-12 relative z-10 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 p-6 md:p-10">

          {/* HOUSE SIZE */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                <Home size={14} className="text-white" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">House Size</h3>
            </div>
            <p className="text-slate-400 text-xs ml-11 mb-6">Select the size that matches your home</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {HOUSE_SIZES.map(({ id, desc }) => {
                const selected = houseSize === id;
                return (
                  <Card
                    key={id}
                    onClick={() => setHouseSize(id)}
                    className={`
                      relative p-5 cursor-pointer transition-all duration-200 rounded-2xl border-2 group
                      ${selected
                        ? "border-blue-600 bg-gradient-to-br from-blue-50 to-blue-50/30 shadow-lg shadow-blue-100"
                        : "border-slate-100 bg-slate-50/60 hover:border-slate-200 hover:bg-white hover:shadow-md"
                      }
                    `}
                  >
                    <p className={`text-lg font-black ${selected ? "text-blue-700" : "text-slate-900"}`}>{id}</p>
                    <p className={`text-xs mt-0.5 font-medium ${selected ? "text-blue-400" : "text-slate-400"}`}>{desc}</p>
                    {/* {selected && (
                      <div className="absolute top-3 right-3 bg-blue-600 text-white p-1 rounded-lg">
                        <Check size={10} strokeWidth={4} />
                      </div>
                    )} */}
                  </Card>
                );
              })}
            </div>
          </div>

          {/* DIVIDER */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Household</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* MEMBERS */}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                <Users size={14} className="text-white" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Number of Members</h3>
            </div>
            <p className="text-slate-400 text-xs ml-11 mb-6">How many people live in your home?</p>

            <div className="flex items-center gap-5">
              <button
                onClick={() => setMembers(prev => Math.max(1, prev - 1))}
                className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 hover:border-slate-300 flex items-center justify-center transition-all duration-150 active:scale-95"
              >
                <Minus size={16} className="text-slate-600" strokeWidth={3} />
              </button>

              <div className="min-w-[80px] h-14 rounded-2xl bg-[#1E293B] flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white leading-none">{members}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  {members === 1 ? "person" : "people"}
                </span>
              </div>

              <button
                onClick={() => setMembers(prev => prev + 1)}
                className="w-11 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 border-2 border-blue-600 flex items-center justify-center transition-all duration-150 active:scale-95 shadow-lg shadow-blue-200"
              >
                <Plus size={16} className="text-white" strokeWidth={3} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* FIXED CTA */}
      <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-100 p-4 flex items-center justify-center gap-4 z-50">
        <span className="text-xs font-bold text-slate-400 hidden sm:block">
          {houseSize} · {members} member{members > 1 ? "s" : ""}
        </span>
        <Button
          variant="primary"
          onClick={next}
          className="w-full max-w-sm py-3.5 rounded-2xl font-black text-sm tracking-wide bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200 transition-all"
        >
          CONTINUE TO SCHEDULE →
        </Button>
      </div>
    </div>
  );
}

export default Requirements;