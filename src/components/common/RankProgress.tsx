import { useState } from 'react';
import type { RankLevel } from '../../types';

const RANK_ORDER = ["GREEN", "YELLOW", "PURPLE", "GOLD", "VIP"] as const;

type RankProgressProps = {
  rankLevel: RankLevel;
  roomCreateCount?: number;
};

const rankLabelMap: Record<RankLevel, string> = {
  GREEN: "GREEN",
  YELLOW: "YELLOW",
  PURPLE: "PURPLE",
  GOLD: "GOLD",
  VIP: "VIP",
};

// 등급별 포인트 색만 관리
const rankStyleMap: Record<
  RankLevel,
  {
    accent: string; // 텍스트/점에만 쓸 색
    topTint: string; // 위쪽에만 살짝 끼울 색
  }
> = {
  GREEN: {
    accent: "#22c55e",
    topTint: "rgba(34,197,94,0.22)",
  },
  YELLOW: {
    accent: "#facc15",
    topTint: "rgba(250,204,21,0.22)",
  },
  PURPLE: {
    accent: "#a855f7",
    topTint: "rgba(168,85,247,0.22)",
  },
  GOLD: {
    accent: "#fbbf24",
    topTint: "rgba(251,191,36,0.22)",
  },
  VIP: {
    accent: "#38bdf8",
    topTint: "rgba(56,189,248,0.22)",
  },
};

const RankProgress = ({
  rankLevel,
  roomCreateCount,
}: RankProgressProps) => {
  const currentIndex = RANK_ORDER.indexOf(rankLevel);
  const style = rankStyleMap[rankLevel];
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="relative overflow-hidden rounded-2xl text-white p-5 sm:p-6 flex gap-4 sm:gap-6"
        style={{
          // 위에서만 살짝 색이 내려오는 느낌
          backgroundImage: `linear-gradient(to bottom, ${style.topTint} 0%, rgba(15,16,32,0) 35%), linear-gradient(to right, #0f1020, #141428)`,
        }}
      >
        {/* 왼쪽 */}
        <div className="flex-1 min-w-0">
          {/* 등급 이름 */}
          <div
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-2"
            style={{ color: style.accent }}
          >
            {rankLabelMap[rankLevel]}
          </div>

          {/* 서브텍스트 */}
          <div className="text-sm text-white/80 mb-6 flex items-center gap-1">
            {roomCreateCount !== undefined
              ? `${roomCreateCount}개 업로드한 밈 · 참여도 등급`
              : "활동 등급"}
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-white/40 text-[10px] leading-none ml-1 hover:bg-white/10"
            >
              i
            </button>
          </div>

          {/* 진행 바 */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1 bg-white/10 rounded-full relative">
              {/* 채워진 부분 */}
              <div
                className="absolute left-0 top-0 h-1 rounded-full transition-all"
                style={{
                  width: `${(currentIndex / (RANK_ORDER.length - 1)) * 100}%`,
                  backgroundColor: style.accent,
                }}
              />
              {/* 점들 */}
              <div className="absolute inset-0 flex justify-between items-center">
                {RANK_ORDER.map((rank, idx) => {
                  const active = idx <= currentIndex;
                  return (
                    <div
                      key={rank}
                      className={`w-3 h-3 rounded-full border-2 transition-colors ${
                        active
                          ? "border-transparent"
                          : "bg-[#0f1020] border-white/25"
                      }`}
                      style={active ? { backgroundColor: style.accent } : {}}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* 아래 랭크 이름들 */}
          <div className="mt-3 flex justify-between text-[11px] sm:text-xs tracking-wide uppercase">
            {RANK_ORDER.map((rank, idx) => {
              const active = idx === currentIndex;
              return (
                <span
                  key={rank}
                  className={active ? "font-semibold" : "text-white/50"}
                  style={active ? { color: style.accent } : {}}
                >
                  {rank}
                </span>
              );
            })}
          </div>
        </div>

        {/* 오른쪽 배지 - 박스 없이 */}
        <div className="hidden sm:flex items-center justify-center">
          <img
            src={`/badge/${rankLevel.toLowerCase()}_badge.png`}
            alt={rankLevel}
            className="w-20 h-20 object-contain"
          />
        </div>
      </div>
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-gray-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
              <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                <img
                  src="/duck.svg"
                  alt="MEMEDUCK Logo"
                  className="w-5 h-5 object-contain"
                />
                MEMEDUCK 랭킹 안내
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
              >
                닫기
              </button>
            </div>

            {/* 내용 */}
            <div className="p-6 bg-white overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="mx-auto max-w-4xl space-y-10">
                {/* 헤더 */}
                <section className="text-center space-y-3">
                  <h1 className="flex items-center justify-center gap-2 text-3xl font-bold tracking-tight">
                    <img
                      src="/duck.svg"
                      alt="MEMEDUCK Logo"
                      className="w-8 h-8 object-contain"
                    />
                    MEMEDUCK 랭킹 시스템 안내
                  </h1>
                  <p className="text-gray-600 text-base">
                    MEMEDUCK 랭킹은 <b>활동적인 팬들에게 주어지는 참여도 등급</b>이에요. <br />팬으로서 얼마나 꾸준히 소통하고,
                    밈을 업로드하고, 덕질에 참여하는지를 기반으로 <b>매일 자동 갱신</b>됩니다.
                  </p>
                </section>

                {/* 등급 종류 - 피라미드 버전 */}
                <section className="space-y-4">
                  <h2 className="text-xl font-semibold">🌈 등급 종류</h2>

                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* 왼쪽: 피라미드 */}
                    <div className="relative w-48 mx-auto lg:mx-0">
                      {/* VIP */}
                      <div
                        className="rounded-l-[9999px] rounded-tr-[12px] rounded-br-[4px] h-12 ml-0 flex items-center justify-between px-4 text-sky-600 text-sm font-semibold shadow"
                        style={{
                          background: "linear-gradient(90deg, rgba(56,189,248,0.22), #38bdf8)",
                        }}
                      >
                        <span>VIP</span>
                        <span className="text-xs opacity-80">TOP</span>
                      </div>

                      {/* GOLD */}
                      <div
                        className="rounded-l-[9999px] rounded-tr-[12px] rounded-br-[4px] h-12 ml-3 mt-2 flex items-center justify-between px-4 text-yellow-600 text-sm font-semibold shadow"
                        style={{
                          background: "linear-gradient(90deg, rgba(251,191,36,0.22), #fbbf24)",
                        }}
                      >
                        <span>GOLD</span>
                        <span className="text-xs opacity-70">활발</span>
                      </div>

                      {/* PURPLE */}
                      <div
                        className="rounded-l-[9999px] rounded-tr-[12px] rounded-br-[4px] h-12 ml-6 mt-2 flex items-center justify-between px-4 text-purple-600 text-sm font-semibold shadow"
                        style={{
                          background: "linear-gradient(90deg, rgba(168,85,247,0.22), #a855f7)",
                        }}
                      >
                        <span>PURPLE</span>
                        <span className="text-xs opacity-70">꾸준</span>
                      </div>

                      {/* YELLOW */}
                      <div
                        className="rounded-l-[9999px] rounded-tr-[12px] rounded-br-[4px] h-12 ml-9 mt-2 flex items-center justify-between px-4 text-amber-600 text-sm font-semibold shadow"
                        style={{
                          background: "linear-gradient(90deg, rgba(250,204,21,0.22), #facc15)",
                        }}
                      >
                        <span>YELLOW</span>
                        <span className="text-xs opacity-70">시작</span>
                      </div>

                      {/* GREEN */}
                      <div
                        className="rounded-l-[9999px] rounded-tr-[12px] rounded-br-[4px] h-12 ml-12 mt-2 flex items-center justify-between px-4 text-emerald-600 text-sm font-semibold shadow"
                        style={{
                          background: "linear-gradient(90deg, rgba(34,197,94,0.22), #22c55e)",
                        }}
                      >
                        <span>GREEN</span>
                        <span className="text-xs opacity-70">신규</span>
                      </div>
                    </div>

                    {/* 오른쪽: 실제 배지 + 한 줄 설명 */}
                    <div className="flex-1 space-y-4">
                      {/* VIP */}
                      <div className="flex items-center gap-3">
                        <img
                          src="/badge/vip_badge.png"
                          alt="VIP Badge"
                          className="w-10.5 h-10.5 object-contain"
                        />
                        <p className="text-sm text-gray-700">
                          <b>가장 활발하게 활동하는 팬!</b> MEMEDUCK이 인정한 TOP 팬이에요.
                        </p>
                      </div>

                      {/* GOLD */}
                      <div className="flex items-center gap-3">
                        <img src="/badge/gold_badge.png" alt="Gold Badge" className="w-10.5 h-10.5 object-contain" />
                        <p className="text-sm text-gray-700">
                          <b>활발한 참여와 꾸준한 활동</b>으로 커뮤니티를 이끄는 팬이에요.
                        </p>
                      </div>

                      {/* PURPLE */}
                      <div className="flex items-center gap-3">
                        <img src="/badge/purple_badge.png" alt="Purple Badge" className="w-10.5 h-10.5 object-contain" />
                        <p className="text-sm text-gray-700"><b>꾸준히 활동</b>하고 있는 팬이에요.</p>
                      </div>

                      {/* YELLOW */}
                      <div className="flex items-center gap-3">
                        <img src="/badge/yellow_badge.png" alt="Yellow Badge" className="w-10.5 h-10.5 object-contain" />
                        <p className="text-sm text-gray-700"><b>덕질을 즐겁게 시작</b>한 팬이에요.</p>
                      </div>

                      {/* GREEN */}
                      <div className="flex items-center gap-3">
                        <img src="/badge/green_badge.png" alt="Green Badge" className="w-10.5 h-10.5 object-contain" />
                        <p className="text-sm text-gray-700">
                          <b>새로 합류한 팬!</b> 앞으로의 활동이 기대돼요.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 갱신 주기 */}
                <section className="space-y-2">
                  <h2 className="text-xl font-semibold">📅 갱신 주기</h2>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    <li>등급은 매일 한 번, 전체 활동 데이터를 기반으로 자동 갱신돼요.</li>
                    <li>채팅, 밈 업로드/참여 등 커뮤니티 내 활동에 따라 다음 날 등급이 달라질 수 있어요.</li>
                  </ul>
                </section>

                {/* 혜택 */}
                <section className="space-y-2">
                  <h2 className="text-xl font-semibold">🎁 혜택 안내</h2>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    <li>등급 배지와 프로필 효과 제공</li>
                    <li>상위 등급 전용 이벤트/굿즈 응모 기회</li>
                    <li>리더보드 노출로 커뮤니티 내 인지도 상승 ✨</li>
                  </ul>
                  <p className="text-xs text-gray-500">
                    * 혜택은 추후 업데이트될 수 있어요.
                  </p>
                </section>

                {/* 참고사항 */}
                <section className="space-y-2">
                  <h2 className="text-xl font-semibold">💬 참고사항</h2>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    <li>
                      등급은 <b>활동 참여도와 커뮤니티 기여도</b>를 바탕으로 자동 계산돼요.
                    </li>
                    <li>특정 행동만 반복한다고 해서 등급이 보장되지는 않아요.</li>
                    <li>모든 유저는 동일한 기준으로 평가되며, 매일 새롭게 기회가 주어집니다.</li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RankProgress;
