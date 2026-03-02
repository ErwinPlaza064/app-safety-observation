import EhsMetricCard from "@/Components/Dashboard/EhsMetricCard";
import { CgFileDocument, CgDanger } from "react-icons/cg";
import { BiPulse, BiTrendingUp } from "react-icons/bi";

export default function EhsStatsGrid({ stats, setActiveMetric }) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
            <div
                onClick={() => setActiveMetric("total")}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveMetric("total"); } }}
                role="button"
                tabIndex={0}
                className="cursor-pointer transition-transform hover:scale-[1.02]"
            >
                <EhsMetricCard
                    title="Total"
                    value={stats.total_month}
                    subtitle="Total de registros"
                    color="blue"
                    icon={
                        <CgFileDocument className="w-6 h-6 text-blue-600" />
                    }
                />
            </div>
            <div
                onClick={() => setActiveMetric("open")}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveMetric("open"); } }}
                role="button"
                tabIndex={0}
                className="cursor-pointer transition-transform hover:scale-[1.02]"
            >
                <EhsMetricCard
                    title="Abiertas"
                    value={stats.open}
                    subtitle="Requieren atención"
                    color="orange"
                    icon={<BiPulse className="w-6 h-6 text-orange-500" />}
                />
            </div>
            <div
                onClick={() => setActiveMetric("high_risk")}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveMetric("high_risk"); } }}
                role="button"
                tabIndex={0}
                className="cursor-pointer transition-transform hover:scale-[1.02]"
            >
                <EhsMetricCard
                    title="Riesgo Alto"
                    value={stats.high_risk}
                    subtitle="Acción inmediata"
                    color="red"
                    icon={<CgDanger className="w-6 h-6 text-red-600" />}
                />
            </div>
            <div
                onClick={() => setActiveMetric("closed")}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveMetric("closed"); } }}
                role="button"
                tabIndex={0}
                className="cursor-pointer transition-transform hover:scale-[1.02]"
            >
                <EhsMetricCard
                    title="Cerradas"
                    value={`${stats.closed_rate}%`}
                    subtitle="Tasa de resolución"
                    color="green"
                    icon={
                        <BiTrendingUp className="w-6 h-6 text-green-600" />
                    }
                />
            </div>
            <div
                onClick={() => setActiveMetric("participation_summary")}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveMetric("participation_summary"); } }}
                role="button"
                tabIndex={0}
                className="cursor-pointer transition-transform hover:scale-[1.02]"
            >
                <EhsMetricCard
                    title="Participación"
                    value={`${stats.participation_monthly.rate}%`}
                    subtitle={
                        <div className="flex items-center justify-between text-[11px] font-bold mt-1 border-t border-purple-100 dark:border-purple-800/30 pt-1">
                            <span className="text-gray-400 uppercase">
                                Este Mes:
                            </span>
                            <span className="text-purple-500">
                                {stats.participation_monthly.count}{" "}
                                empleados
                            </span>
                        </div>
                    }
                    color="purple"
                    icon={
                        <svg
                            className="w-6 h-6 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                    }
                />
            </div>
        </div>
    );
}

