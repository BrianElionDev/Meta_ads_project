export enum EnumAdStatus {
  pending = "pending",
  approved = "approved",
  cancelled = "cancelled",
  ready = "ready",
  posted = "posted",
}

export interface UserAds {
  id: string;
  ad_account_ID: string;
  filename: string;
  image_url: string;
  hook: string;
  call_to_action_type: string;
  message: string;
  full_message: string;
  cta_text: string;
  campaign_ID: string;
  campaign_name: string;
  campaign_objective: string;
  adset_ID: string;
  adset_name: string;
  adset_optimization_goal: string;
  image_hash: string;
  ad_creative_ID: string;
  ad_name: string;
  ad_ID: string;
  facebook_image_url: string;
  ad_image_url: string;
  status: EnumAdStatus;
  created_at: string;
  updated_at: string;
  content_creation_completed_at?: string;
  campaign_creation_completed_at?: string;
  adset_creation_completed_at?: string;
  adcreative_creation_completed_at?: string;
  approval_completed_at?: string;
  ad_posting_completed_at?: string;
  n8n_workflow_id?: string;
  error_message?: string;
}
