export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year?: string;
  segment: string;
  priceRange: { min: number; max: number };
  voiceAssistantName?: string;
}

export interface Dimension {
  id: string;
  name: string;
  layer: 1 | 2 | 3;
  weight: number;
}

export interface Evidence {
  id: string;
  content: string;
  source: string;
  author?: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  url?: string;
}

export interface DimensionFinding {
  dimensionId: string;
  dimensionName: string;
  score: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  sentimentDistribution: { positive: number; negative: number; neutral: number };
  keyFindings: string[];
  evidence: Evidence[];
  featureMentions: { name: string; count: number; sentiment: 'positive' | 'negative' | 'neutral' }[];
}

export interface CompetitiveInsight {
  vehicleId: string;
  vehicleName: string;
  overallScore: number;
  dimensionScores: { dimensionId: string; score: number }[];
}

export interface WeaknessObservation {
  dimensionId: string;
  dimensionName: string;
  description: string;
  affectedVehicles: string[];
  evidenceCount: number;
  confidence: 'high' | 'medium' | 'low';
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  evidence: string;
  priority: 'high' | 'medium' | 'low';
  actionSuggestion: string;
  sourceDimension?: string;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  mitigation: string;
  evidenceCount: number;
}

export interface ResearchReport {
  id: string;
  question: string;
  summary: string;
  createdAt: string;
  vehicles: Vehicle[];
  totalFeedback: number;
  sourceBreakdown: { source: string; count: number }[];
  timeRange: { start: string; end: string };
  overallStats: {
    totalFeedback: number;
    sentimentDistribution: { positive: number; negative: number; neutral: number };
    topPainPoints: number;
    opportunitiesFound: number;
  };
  vehicleHealthScores: {
    vehicleId: string;
    vehicleName: string;
    overall: number;
    dimensions: { dimensionId: string; score: number }[];
  }[];
  dimensionFindings: DimensionFinding[];
  competitiveInsights: CompetitiveInsight[];
  weaknessObservations: WeaknessObservation[];
  opportunities: Opportunity[];
  risks: Risk[];
}

export interface DemoCase {
  id: string;
  title: string;
  question: string;
  type: 'competitive' | 'diagnostic' | 'opportunity';
  description: string;
  report: ResearchReport;
}
