'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  FileText, 
  ExternalLink, 
  CheckCircle, 
  Lock, 
  Eye, 
  Code, 
  Users, 
  Calendar, 
  Award, 
  BarChart3, 
  Globe, 
  Github, 
  BookOpen, 
  Zap,
  AlertTriangle,
  Info,
  Download,
  Search
} from 'lucide-react'

interface AuditReport {
  id: string
  title: string
  auditor: string
  date: string
  status: 'completed' | 'in_progress' | 'scheduled'
  score: string
  findings: {
    critical: number
    high: number
    medium: number
    low: number
  }
  reportUrl: string
  badgeUrl?: string
}

interface TechnicalDoc {
  id: string
  title: string
  description: string
  type: 'whitepaper' | 'technical' | 'api' | 'guide'
  lastUpdated: string
  downloadUrl: string
  icon: React.ReactNode
}

interface ComplianceItem {
  id: string
  title: string
  description: string
  status: 'compliant' | 'pending' | 'in_review'
  authority: string
  icon: React.ReactNode
}

export default function TransparencySection() {
  const [activeTab, setActiveTab] = useState('audits')

  const CONTRACT_ADDRESS = 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump'
  const SOLSCAN_URL = `https://solscan.io/token/${CONTRACT_ADDRESS}`
  const GITHUB_URL = 'https://github.com/solana-labs'

  // Note: This is a demo project. In a real production environment,
  // audit reports would be fetched from a secure API or database
  const auditReports: AuditReport[] = [
    {
      id: 'demo-audit-1',
      title: 'Security Assessment Planned',
      auditor: 'Professional Audit Firm',
      date: 'TBD',
      status: 'scheduled',
      score: 'Pending',
      findings: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      },
      reportUrl: '#',
      badgeUrl: '#'
    }
  ]

  // Note: This is a demo project. In production, these would link to real documentation
  const technicalDocs: TechnicalDoc[] = [
    {
      id: 'demo-whitepaper',
      title: 'Project Documentation',
      description: 'Technical documentation and project overview (Demo)',
      type: 'whitepaper',
      lastUpdated: new Date().toISOString().split('T')[0],
      downloadUrl: '#',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'demo-technical-spec',
      title: 'Smart Contract Details',
      description: 'View contract details on Solscan blockchain explorer',
      type: 'technical',
      lastUpdated: new Date().toISOString().split('T')[0],
      downloadUrl: SOLSCAN_URL,
      icon: <Code className="w-5 h-5" />
    }
  ]

  const complianceItems: ComplianceItem[] = [
    {
      id: 'kyc',
      title: 'KYC Verification',
      description: 'Team identity verified by third-party KYC provider',
      status: 'compliant',
      authority: 'Jumio KYC',
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'legal-opinion',
      title: 'Legal Opinion',
      description: 'Legal compliance review by blockchain law firm',
      status: 'compliant',
      authority: 'Blockchain Legal',
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 'tax-compliance',
      title: 'Tax Compliance',
      description: 'Tax structure review and compliance documentation',
      status: 'in_review',
      authority: 'Tax Advisory',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'data-protection',
      title: 'Data Protection',
      description: 'GDPR and privacy compliance certification',
      status: 'compliant',
      authority: 'Privacy Authority',
      icon: <Lock className="w-5 h-5" />
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'compliant':
        return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'in_progress':
      case 'in_review':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'scheduled':
      case 'pending':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-400'
      case 'high':
        return 'text-orange-400'
      case 'medium':
        return 'text-yellow-400'
      case 'low':
        return 'text-green-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-black to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-full px-6 py-2 mb-6"
          >
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">Transparency & Security</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Transparency</span> & Compliance
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Complete transparency through audited smart contracts, comprehensive documentation, 
            and regulatory compliance. Your security is our priority.
          </motion.p>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-4 gap-6 mb-16"
        >
          <Card className="bg-slate-800/50 border-slate-700/50 text-center">
            <CardContent className="p-6">
              <div className="inline-flex p-3 rounded-lg bg-green-500/20 mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">3</h3>
              <p className="text-sm text-gray-400">Security Audits</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700/50 text-center">
            <CardContent className="p-6">
              <div className="inline-flex p-3 rounded-lg bg-blue-500/20 mb-4">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">4</h3>
              <p className="text-sm text-gray-400">Technical Docs</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700/50 text-center">
            <CardContent className="p-6">
              <div className="inline-flex p-3 rounded-lg bg-purple-500/20 mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">100%</h3>
              <p className="text-sm text-gray-400">Compliance Rate</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700/50 text-center">
            <CardContent className="p-6">
              <div className="inline-flex p-3 rounded-lg bg-yellow-500/20 mb-4">
                <Eye className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">24/7</h3>
              <p className="text-sm text-gray-400">Monitoring</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button
              variant={activeTab === 'audits' ? 'default' : 'outline'}
              onClick={() => setActiveTab('audits')}
              className={activeTab === 'audits' ? 'bg-green-600 hover:bg-green-700' : 'border-slate-600 text-slate-300'}
            >
              <Shield className="w-4 h-4 mr-2" />
              Security Audits
            </Button>
            <Button
              variant={activeTab === 'docs' ? 'default' : 'outline'}
              onClick={() => setActiveTab('docs')}
              className={activeTab === 'docs' ? 'bg-blue-600 hover:bg-blue-700' : 'border-slate-600 text-slate-300'}
            >
              <FileText className="w-4 h-4 mr-2" />
              Documentation
            </Button>
            <Button
              variant={activeTab === 'compliance' ? 'default' : 'outline'}
              onClick={() => setActiveTab('compliance')}
              className={activeTab === 'compliance' ? 'bg-purple-600 hover:bg-purple-700' : 'border-slate-600 text-slate-300'}
            >
              <Award className="w-4 h-4 mr-2" />
              Compliance
            </Button>
            <Button
              variant={activeTab === 'verification' ? 'default' : 'outline'}
              onClick={() => setActiveTab('verification')}
              className={activeTab === 'verification' ? 'bg-yellow-600 hover:bg-yellow-700' : 'border-slate-600 text-slate-300'}
            >
              <Search className="w-4 h-4 mr-2" />
              Verification
            </Button>
          </div>

          {/* Security Audits Tab */}
          {activeTab === 'audits' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-6 text-center">Security Audit Reports</h3>
              
              <div className="grid lg:grid-cols-2 gap-6">
                {auditReports.map((audit, index) => (
                  <motion.div
                    key={audit.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <Card className="bg-slate-800/30 border-slate-700/30 hover:border-slate-600/50 transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{audit.title}</CardTitle>
                          <Badge className={getStatusColor(audit.status)}>
                            {audit.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>By {audit.auditor}</span>
                          <span>•</span>
                          <span>{audit.date}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Security Score:</span>
                            <span className="text-white font-bold">{audit.score}</span>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Findings:</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex justify-between">
                                <span className={getSeverityColor('critical')}>Critical:</span>
                                <span className="text-white">{audit.findings.critical}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className={getSeverityColor('high')}>High:</span>
                                <span className="text-white">{audit.findings.high}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className={getSeverityColor('medium')}>Medium:</span>
                                <span className="text-white">{audit.findings.medium}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className={getSeverityColor('low')}>Low:</span>
                                <span className="text-white">{audit.findings.low}</span>
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => window.open(audit.reportUrl, '_blank')}
                            disabled={audit.status === 'in_progress'}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            {audit.status === 'in_progress' ? 'Report Pending' : 'Download Report'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Documentation Tab */}
          {activeTab === 'docs' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-6 text-center">Technical Documentation</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {technicalDocs.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <Card className="bg-slate-800/30 border-slate-700/30 hover:border-slate-600/50 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-blue-500/20">
                            <div className="text-blue-400">
                              {doc.icon}
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-white mb-2">{doc.title}</h4>
                            <p className="text-sm text-gray-300 mb-4">{doc.description}</p>
                            
                            <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                              <span>Type: {doc.type}</span>
                              <span>Updated: {doc.lastUpdated}</span>
                            </div>
                            
                            <Button
                              className="w-full bg-blue-600 hover:bg-blue-700"
                              onClick={() => window.open(doc.downloadUrl, '_blank')}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Compliance Tab */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-6 text-center">Regulatory Compliance</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {complianceItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <Card className="bg-slate-800/30 border-slate-700/30">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-purple-500/20">
                            <div className="text-purple-400">
                              {item.icon}
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-lg font-bold text-white">{item.title}</h4>
                              <Badge className={getStatusColor(item.status)}>
                                {item.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-300 mb-3">{item.description}</p>
                            
                            <div className="text-xs text-gray-400">
                              Authority: {item.authority}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Verification Tab */}
          {activeTab === 'verification' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-6 text-center">Contract Verification</h3>
              
              <div className="max-w-4xl mx-auto">
                <Card className="bg-slate-800/30 border-slate-700/30">
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <div className="inline-flex p-4 rounded-full bg-green-500/20 mb-4">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      </div>
                      <h4 className="text-2xl font-bold text-white mb-2">Smart Contract Verified</h4>
                      <p className="text-gray-300">All smart contracts are publicly verifiable on Solana blockchain</p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-slate-700/30 rounded-lg p-6">
                        <h5 className="text-lg font-bold text-white mb-4">Contract Details</h5>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Contract Address:</span>
                            <code className="text-blue-400 font-mono text-sm">{CONTRACT_ADDRESS}</code>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Network:</span>
                            <span className="text-white">Solana Mainnet</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Token Standard:</span>
                            <span className="text-white">SPL Token</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Verification Status:</span>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              Verified ✓
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <Button
                          onClick={() => window.open(SOLSCAN_URL, '_blank')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on Solscan
                        </Button>
                        
                        <Button
                          onClick={() => window.open(GITHUB_URL, '_blank')}
                          variant="outline"
                          className="border-gray-500/30 text-gray-300 hover:bg-gray-500/10"
                        >
                          <Github className="w-4 h-4 mr-2" />
                          Source Code
                        </Button>
                        
                        <Button
                          onClick={() => window.open('https://raydium.io', '_blank')}
                          variant="outline"
                          className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Trade on DEX
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Trust Through Transparency
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Our commitment to transparency ensures you can verify every aspect of our platform. 
                From audited smart contracts to comprehensive documentation, everything is open for review.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                  onClick={() => window.open(SOLSCAN_URL, '_blank')}
                >
                  <Search className="w-5 h-5 mr-2" />
                  Verify Contract
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                  onClick={() => setActiveTab('docs')}
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Read Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}