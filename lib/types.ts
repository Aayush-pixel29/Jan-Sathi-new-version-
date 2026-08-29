export interface ExtractedFields {
  what: string;
  where: string;
  when: string;
  references: string[];
}

export interface ClassificationResult {
  department: string;
  category: string;
  sub_category: string;
  priority: 'High' | 'Medium' | 'Low';
  extracted_fields: ExtractedFields;
  structured_draft: string;
}

export interface StatusEntry {
  status: GrievanceStatus;
  timestamp: string;
  explanation?: string;
}

export type GrievanceStatus = 'Filed' | 'Forwarded' | 'Under Review' | 'Action Taken' | 'Closed';

export interface Grievance {
  id: string;
  tracking_id: string;
  raw_text: string;
  structured_text: string;
  department: string;
  category: string;
  sub_category: string;
  priority: 'High' | 'Medium' | 'Low';
  status: GrievanceStatus;
  status_history: StatusEntry[];
  created_at: string;
  updated_at: string;
  sla_hours: number;
}

export interface StatusTranslation {
  explanation: string;
  next_steps: string;
  estimated_wait: string;
}

export interface EscalationResult {
  escalation_letter: string;
  addressed_to: string;
}
