import Sidebar from './components/Sidebar'
import NavPanel from './components/NavPanel'
import TopNavbar from './components/TopNavbar'
import StatsRow from './components/StatsRow'
import PipelineVelocity from './components/PipelineVelocity'
import SourceBreakdown from './components/SourceBreakdown'
import DealsAmount from './components/DealsAmount'
import PlatformPerformance from './components/PlatformPerformance'
import TeamLeaderboard from './components/TeamLeaderboard'
import SalesDynamic from './components/SalesDynamic'
import ChatPanel from './components/ChatPanel'

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <NavPanel />

      <main className="flex-1 ml-[272px] min-h-screen pb-[80px]">
        <TopNavbar />

        <div className="max-w-[1600px] mx-auto px-8 pt-4 pb-12 space-y-8">
          <StatsRow />
          <PipelineVelocity />

          {/* Middle Section (50/50) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SourceBreakdown />
            <DealsAmount />
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-12 gap-6">
            <PlatformPerformance />
            <TeamLeaderboard />
          </div>

          <SalesDynamic />
        </div>
      </main>

      <ChatPanel />
    </div>
  )
}

export default App
