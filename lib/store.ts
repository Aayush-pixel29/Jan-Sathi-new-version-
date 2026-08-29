import { Grievance, GrievanceStatus } from './types';

const grievances = new Map<string, Grievance>();

const STATUS_ORDER: GrievanceStatus[] = ['Filed', 'Forwarded', 'Under Review', 'Action Taken', 'Closed'];

// Seed demo data
grievances.set('JS-20260829-DEMO', {
  id: 'demo-1',
  tracking_id: 'JS-20260829-DEMO',
  raw_text: 'Mera ration card ka application reject ho gaya bina kisi reason ke. Maine sab documents diye the lekin phir bhi reject kar diya. Koi reason nahi bataya. Ye bahut galat hai, hum garib log hain aur humein ration ki zaroorat hai.',
  structured_text: 'Subject: Wrongful Rejection of Ration Card Application Without Stated Reason\n\nRespected Sir/Madam,\n\nI am writing to bring to your attention the unjustified rejection of my ration card application. I had submitted all required documents as per the prescribed checklist, yet my application was rejected without any reason being communicated to me.\n\nThis has caused significant hardship to my family as we depend on the Public Distribution System for essential food supplies. I request that my application be reviewed again and the specific reason for rejection, if any, be communicated to me in writing.\n\nI kindly request your urgent intervention in this matter.',
  department: 'Food & Public Distribution (PDS/Ration)',
  category: 'Ration Card',
  sub_category: 'Application Rejection',
  priority: 'High',
  status: 'Under Review',
  status_history: [
    { status: 'Filed', timestamp: '2026-08-20T10:00:00Z' },
    { status: 'Forwarded', timestamp: '2026-08-21T14:00:00Z' },
    { status: 'Under Review', timestamp: '2026-08-22T09:00:00Z' },
  ],
  created_at: '2026-08-20T10:00:00Z',
  updated_at: '2026-08-22T09:00:00Z',
  sla_hours: 168,
});

grievances.set('JS-20260829-PEN1', {
  id: 'demo-2',
  tracking_id: 'JS-20260829-PEN1',
  raw_text: 'My mothers pension has not been credited for the last 4 months. She is 72 years old and depends entirely on her pension. We have visited the post office multiple times but they keep saying it will come next month.',
  structured_text: 'Subject: Non-Disbursement of Old Age Pension for 4 Consecutive Months\n\nRespected Sir/Madam,\n\nI wish to bring to your urgent attention that the old age pension of my mother has not been credited for the last four months. She is 72 years old and is entirely dependent on this pension for her livelihood.\n\nDespite multiple visits to our local post office, we have only been given verbal assurances that the pension will be disbursed next month, with no concrete action taken.\n\nI request your immediate intervention to ensure the pending pension amount is released at the earliest.',
  department: 'Pension & Pensioners Welfare',
  category: 'Pension Disbursement',
  sub_category: 'Delay in Payment',
  priority: 'High',
  status: 'Forwarded',
  status_history: [
    { status: 'Filed', timestamp: '2026-08-27T10:00:00Z' },
    { status: 'Forwarded', timestamp: '2026-08-28T11:00:00Z' },
  ],
  created_at: '2026-08-27T10:00:00Z',
  updated_at: '2026-08-28T11:00:00Z',
  sla_hours: 168,
});

export function getGrievance(trackingId: string): Grievance | undefined {
  return grievances.get(trackingId);
}

export function saveGrievance(grievance: Grievance): void {
  grievances.set(grievance.tracking_id, grievance);
}

export function advanceStatus(trackingId: string): Grievance | undefined {
  const g = grievances.get(trackingId);
  if (!g) return undefined;
  const currentIndex = STATUS_ORDER.indexOf(g.status);
  if (currentIndex < STATUS_ORDER.length - 1) {
    const newStatus = STATUS_ORDER[currentIndex + 1];
    g.status = newStatus;
    g.status_history.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
    });
    g.updated_at = new Date().toISOString();
    grievances.set(trackingId, g);
  }
  return g;
}

export function getAllGrievances(): Grievance[] {
  return Array.from(grievances.values());
}

export function isStalled(grievance: Grievance): boolean {
  const lastUpdate = new Date(grievance.updated_at).getTime();
  const now = Date.now();
  const hoursSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60);
  // For demo: stalled if status is Under Review and last update > 1 hour ago
  // (In real system this would be sla_hours)
  return grievance.status === 'Under Review' && hoursSinceUpdate > 1;
}
