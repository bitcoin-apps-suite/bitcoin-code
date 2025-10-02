import React from 'react'
import { AlertTriangle } from 'lucide-react'
import './ProofOfConceptBar.css'

const ProofOfConceptBar: React.FC = () => {
  return (
    <div className="poc-bar">
      <div className="poc-content">
        <AlertTriangle className="w-4 h-4 poc-icon" />
        <span className="poc-text">PROOF OF CONCEPT - This is a demonstration of Bitcoin Code</span>
        <AlertTriangle className="w-4 h-4 poc-icon" />
      </div>
    </div>
  )
}

export default ProofOfConceptBar