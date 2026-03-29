import StatsRow from '../components/StatsRow'
import PipelineVelocity from '../components/PipelineVelocity'
import InsightsPanel from '../components/InsightsPanel'
import SourceBreakdown from '../components/SourceBreakdown'
import DealsAmount from '../components/DealsAmount'
import PlatformPerformance from '../components/PlatformPerformance'
import TeamLeaderboard from '../components/TeamLeaderboard'
import SalesDynamic from '../components/SalesDynamic'
import ChatPanel from '../components/ChatPanel'

export default function Dashboard() {
  return (
    <>
      <div className="max-w-[1600px] mx-auto px-8 pt-4 pb-12 space-y-8">
        <StatsRow />
        <PipelineVelocity />
        <InsightsPanel />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SourceBreakdown />
          <DealsAmount />
        </div>
        <div className="grid grid-cols-12 gap-6">
          <PlatformPerformance />
          <TeamLeaderboard />
        </div>
        <SalesDynamic />
      </div>
      <ChatPanel />
    </>
  )
}
