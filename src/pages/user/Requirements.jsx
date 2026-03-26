import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";

function Requirements() {

  const location = useLocation();
  const navigate = useNavigate();

  const { services, hoursPerDay } = location.state || {};

  const [houseSize, setHouseSize] = useState("1BHK");
  const [members, setMembers] = useState(4);

  const HOUSE_SIZES = ["1BHK", "2BHK", "3BHK", "4BHK+"];

  const next = () => {
    if (!houseSize || members <= 0) return;

    navigate("/user/date", {
      state: {
        services,
        hoursPerDay,
        houseSize,
        members
      }
    });
  };

  return (
    <Container>

      {/* 🔥 HEADER */}
      <div className="mb-8 animate-fadeIn">

        <h2 className="
          text-3xl font-bold
          bg-brand-gradient bg-clip-text text-transparent
        ">
          House Details 🏠
        </h2>

        <p className="text-textSub mt-2">
          Help us customize your service
        </p>

      </div>

      {/* 🔥 HOUSE SIZE */}
      <div className="mb-10">

        <h3 className="text-lg font-semibold mb-4 text-textMain">
          Select House Size
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">

          {HOUSE_SIZES.map(size => {
            const selected = houseSize === size;

            return (
              <Card
                key={size}
                onClick={() => setHouseSize(size)}
                className={`group text-center overflow-hidden
                  ${selected && "text-white scale-[1.05] shadow-glow"}
                `}
              >

                {/* GRADIENT */}
                {selected && (
                  <div className="absolute inset-0 bg-brand-gradient" />
                )}

                <div className="relative">

                  <span className="font-medium">
                    {size}
                  </span>

                  {/* underline */}
                  <div className="
                    mt-2 h-[2px] w-0
                    bg-brand-gradient
                    transition-all duration-300
                    group-hover:w-full
                  " />

                </div>

              </Card>
            );
          })}

        </div>

      </div>

      {/* 🔥 MEMBERS */}
      <div className="mb-24">

        <h3 className="text-lg font-semibold mb-4 text-textMain">
          Number of Members
        </h3>

        <div className="flex items-center gap-6">

          {/* MINUS */}
          <button
            onClick={() => setMembers(prev => Math.max(1, prev - 1))}
            className="
              w-12 h-12 rounded-full
              bg-white border border-borderLight
              hover:shadow-lg hover:scale-105
              active:scale-95
              transition-all duration-300
            "
          >
            -
          </button>

          {/* VALUE */}
          <div className="
            px-6 py-2 rounded-xl text-lg font-semibold
            bg-brand-gradient text-white shadow-glow
          ">
            {members}
          </div>

          {/* PLUS */}
          <button
            onClick={() => setMembers(prev => prev + 1)}
            className="
              w-12 h-12 rounded-full
              bg-white border border-borderLight
              hover:shadow-lg hover:scale-105
              active:scale-95
              transition-all duration-300
            "
          >
            +
          </button>

        </div>

      </div>

      {/* 🔥 CTA */}
      <div className="
        fixed bottom-0 left-0 w-full
        bg-white/80 backdrop-blur-md
        border-t border-borderLight
        p-4 flex justify-center shadow-soft
      ">

        <button
          onClick={next}
          className="
            w-full max-w-md py-3 rounded-xl text-white font-medium
            bg-brand-gradient
            hover:scale-[1.03] active:scale-[0.97]
            transition-all duration-300
            shadow-glow
          "
        >
          Continue →
        </button>

      </div>

    </Container>
  );
}

export default Requirements;