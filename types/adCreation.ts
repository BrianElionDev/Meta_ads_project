export interface AdCampaign {
    campaign_creation?: string;
    new_ad_campaign_name?: string;
    ad_campaign_objective?: string;
    ad_set_name?: string;
    target_audience?: string | null;
    target_country_or_countries?: string | null;
    budget_preference?: string | null;
    campaign_budget?: number | null;
    ad_posting_platform?: string;
    ad_description?: string;
    ad_headline?: string;
    campaign_duration?: string | null;
    website_url?: string;
    additional_notes?: string;
    email?: string;
    Advert_ready_media_id?: string | null;
    Client_business_website_page?: string;
    ad_set_creation?: string;
    existing_ad_campaign_name?: string | null;
    ad_campaign_id?: string | null;
    existing_ad_set_name?: string | null;
    ad_set_id?: string | null;
    ad_creative_creation?: string;
    existing_ad_creative_name?: string | null;
    ad_creative_id?: string | null;
    submitteded_media_file?: string | null;
  }
  