import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { 
  ChevronLeft,
  ChevronRight,
  Monitor,
  FileCode,
  Users,
  FileText,
  Coins,
  Github,
  GitPullRequest,
  ExternalLink,
  BookOpen,
  History,
  CheckCircle,
  ListTodo,
  Briefcase,
  Terminal,
  Package,
  Download,
  Upload,
  Lock,
  Unlock,
  Activity,
  Clock
} from 'lucide-react'
import './OSDevSidebar.css'

interface DevSidebarProps {
  onToggle?: (isCollapsed: boolean) => void;
}

export default function DevSidebar({ onToggle }: DevSidebarProps) {
  const location = useLocation()
  const pathname = location.pathname
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('devSidebarCollapsed')
      // Default to collapsed (closed) for first-time visitors
      return saved !== null ? saved === 'true' : true
    }
    return true
  })
  const [issueCount, setIssueCount] = useState<number>(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('devSidebarCollapsed', isCollapsed.toString())
    }
    // Notify parent component of state change
    onToggle?.(isCollapsed)
  }, [isCollapsed, onToggle])

  // Initial notification to parent component
  useEffect(() => {
    onToggle?.(isCollapsed)
  }, [onToggle])

  // Fetch GitHub issues count
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/bitcoin-apps-suite/bitcoin-code/issues?state=open')
        const data = await response.json()
        setIssueCount(Array.isArray(data) ? data.length : 0)
      } catch (error) {
        console.error('Error fetching issues:', error)
        setIssueCount(0)
      }
    }
    fetchIssues()
  }, [])

  const menuItems: Array<{
    path?: string
    icon?: any
    label?: string
    badge?: string
    divider?: boolean
    section?: string
    external?: boolean
  }> = [
    // Token & Ecosystem
    { path: '/token', icon: Coins, label: '$BCODE Token', badge: 'NEW' },
    { path: '/exchange', icon: Download, label: 'Token Exchange' },
    { path: '/contracts', icon: Terminal, label: 'Smart Contracts', badge: 'BETA' },
    
    // Developers Section
    { divider: true },
    { section: 'DEVELOPERS' },
    { path: '/developers/create-offer', icon: Upload, label: 'Create Service Offer' },
    { path: 'https://github.com/bitcoin-apps-suite/bitcoin-code/issues', icon: Briefcase, label: 'Find Contracts', badge: issueCount > 0 ? String(issueCount) : '0', external: true },
    { path: '/developers/guides', icon: BookOpen, label: 'Development Guides' },
    { path: '/developers/templates', icon: FileCode, label: 'Code Templates' },
    
    // Maintainers Section
    { divider: true },
    { section: 'MAINTAINERS' },
    { path: '/maintainers/commission', icon: Coins, label: 'Commission Development' },
    { path: '/maintainers/find-developers', icon: Users, label: 'Find Developers', badge: '42' },
    { path: '/maintainers/enterprise', icon: Lock, label: 'Enterprise Solutions' },
    { path: '/maintainers/reviews', icon: CheckCircle, label: 'Code Reviews' },
    
    // Contributors Section  
    { divider: true },
    { section: 'CONTRIBUTORS' },
    { path: '/contributors/tasks', icon: ListTodo, label: 'Open Source Tasks' },
    { path: '/contributors/bounties', icon: Package, label: 'Bounty Programs' },
    { path: '/contributors/projects', icon: Activity, label: 'Community Projects' },
    { path: '/contributors', icon: Users, label: 'All Contributors', badge: '42' },
    
    // System & Tools
    { divider: true },
    { section: 'SYSTEM & TOOLS' },
    { path: '/api', icon: Package, label: 'API Reference' },
    { path: 'https://github.com/bitcoin-apps-suite/bitcoin-code', icon: Github, label: 'GitHub Repository', external: true },
    { path: 'https://github.com/bitcoin-apps-suite/bitcoin-code/pulls', icon: GitPullRequest, label: 'Pull Requests', external: true },
    { path: '/docs', icon: FileText, label: 'Documentation' },
    { path: '/changelog', icon: History, label: 'Changelog' },
    { path: '/status', icon: CheckCircle, label: 'System Status', badge: 'OK' }
  ]

  const stats = {
    totalSupply: '1,000,000,000',
    distributed: '12,456,789',
    activeDevelopers: '42',
    openContracts: issueCount || 0,
    activeMaintainers: '15',
    bountyPool: '₿2.5'
  }

  return (
    <div className={`dev-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="dev-sidebar-header">
        {!isCollapsed && (
          <div className="dev-sidebar-title">
            <Monitor className="dev-sidebar-logo" />
            <span>Developer Hub</span>
          </div>
        )}
        <button 
          className="dev-sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="dev-sidebar-nav">
        {menuItems.map((item, index) => {
          if (item.divider) {
            return <div key={index} className="dev-sidebar-divider" />
          }

          if (item.section) {
            return !isCollapsed ? (
              <div key={index} className="dev-sidebar-section">
                {item.section}
              </div>
            ) : null
          }

          const Icon = item.icon
          const isActive = pathname === item.path

          if (item.external) {
            return (
              <a
                key={`${item.path}-${index}`}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className={`dev-sidebar-item ${isActive ? 'active' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={20} />
                {!isCollapsed && (
                  <>
                    <span className="dev-sidebar-label">{item.label}</span>
                    {item.badge && <span className="dev-sidebar-badge">{item.badge}</span>}
                  </>
                )}
              </a>
            )
          }

          return (
            <a
              key={`${item.path}-${index}`}
              href={item.path || '/'}
              className={`dev-sidebar-item ${isActive ? 'active' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={20} />
              {!isCollapsed && (
                <>
                  <span className="dev-sidebar-label">{item.label}</span>
                  {item.badge && <span className="dev-sidebar-badge">{item.badge}</span>}
                </>
              )}
            </a>
          )
        })}
      </nav>

      {/* Stats section */}
      {!isCollapsed && (
        <div className="dev-sidebar-stats">
          <h4>Platform Stats</h4>
          <div className="dev-stat">
            <span className="dev-stat-label">Total Supply</span>
            <span className="dev-stat-value">{stats.totalSupply}</span>
          </div>
          <div className="dev-stat">
            <span className="dev-stat-label">Distributed</span>
            <span className="dev-stat-value">{stats.distributed}</span>
          </div>
          <div className="dev-stat">
            <span className="dev-stat-label">Active Developers</span>
            <span className="dev-stat-value">{stats.activeDevelopers}</span>
          </div>
          <div className="dev-stat">
            <span className="dev-stat-label">Open Contracts</span>
            <span className="dev-stat-value">{stats.openContracts}</span>
          </div>
          <div className="dev-stat">
            <span className="dev-stat-label">Maintainers</span>
            <span className="dev-stat-value">{stats.activeMaintainers}</span>
          </div>
          <div className="dev-stat">
            <span className="dev-stat-label">Bounty Pool</span>
            <span className="dev-stat-value">{stats.bountyPool}</span>
          </div>
        </div>
      )}

      {/* Footer CTA */}
      {!isCollapsed && (
        <div className="dev-sidebar-footer">
          <div className="dev-sidebar-cta">
            <p>Join the Code Economy</p>
            <a 
              href="/developers/create-offer" 
              className="dev-sidebar-cta-button"
            >
              Create Service Offer
            </a>
          </div>
        </div>
      )}
    </div>
  )
}