'use client'

import React, { useState, useEffect } from 'react'
import ProofOfConceptBar from './ProofOfConceptBar'
import CleanTaskbar from './CleanTaskbar'
import DevSidebar from './OSDevSidebar'
import Dock from './Dock'
import MinimalDock from './MinimalDock'
import ContractWizard from './ContractWizard'
import TokenDashboard from './TokenDashboard'
import TickerSidebar from './TickerSidebar'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isDevSidebarCollapsed, setIsDevSidebarCollapsed] = useState(true)
  const [showContractWizard, setShowContractWizard] = useState(false)
  const [showTokenDashboard, setShowTokenDashboard] = useState(false)
  const [dockStyle, setDockStyle] = useState<'large' | 'minimal'>('large')
  const [isTickerCollapsed, setIsTickerCollapsed] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const savedDockStyle = localStorage.getItem('dockStyle') as 'large' | 'minimal' | null
    if (savedDockStyle) {
      setDockStyle(savedDockStyle)
    }

    const handleDockStyleChange = (event: CustomEvent) => {
      setDockStyle(event.detail)
    }

    const handleTickerToggle = (event: CustomEvent) => {
      setIsTickerCollapsed(event.detail)
    }

    window.addEventListener('dockStyleChanged', handleDockStyleChange as EventListener)
    window.addEventListener('tickerToggled', handleTickerToggle as EventListener)
    
    return () => {
      window.removeEventListener('dockStyleChanged', handleDockStyleChange as EventListener)
      window.removeEventListener('tickerToggled', handleTickerToggle as EventListener)
    }
  }, [])

  return (
    <div className="App">
      <ProofOfConceptBar />
      <CleanTaskbar 
        isAuthenticated={false}
        currentUser={null}
        onLogout={() => console.log('Logout')}
        onNewProject={() => console.log('New project')}
        onSaveProject={() => console.log('Save project')}
        onOpenLibraryModal={() => console.log('Open library modal')}
      />
      <div className="app-container" style={{ display: 'flex', flex: 1, position: 'relative', marginTop: '72px' }}>
        <DevSidebar onToggle={setIsDevSidebarCollapsed} />
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          marginLeft: isDevSidebarCollapsed ? '60px' : '260px',
          marginRight: isTickerCollapsed ? '60px' : '280px',
          transition: 'margin-left 0.3s ease, margin-right 0.3s ease'
        }}>
          {children}
        </div>
      </div>
      {dockStyle === 'large' ? <Dock /> : <MinimalDock />}
      <TickerSidebar userHandle="developer" />
      
      {/* Modal Components */}
      <ContractWizard
        isOpen={showContractWizard}
        onClose={() => setShowContractWizard(false)}
        projectId="bitcoin-code-core"
        onContractCreated={(contract) => {
          console.log('Contract created:', contract)
          setShowContractWizard(false)
        }}
      />
      
      <TokenDashboard
        developerId="dev-001"
        isOpen={showTokenDashboard}
        onClose={() => setShowTokenDashboard(false)}
      />
      
      <footer className="global-footer">
        <div className="global-footer-content">
          <p>© 2025 The Bitcoin Corporation LTD. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}