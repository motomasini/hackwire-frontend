const API_BASE = "http://localhost:8009";
const ADMIN_API_BASE = "http://localhost:3000/api/v3/admin";

export type ScopeType = "basic" | "toggle";
export interface ScopeMetadata {
  name: string;
  type: ScopeType;
  options: { name: string; key: string }[];
}

export interface ScopeEnv {
  key: string;
  name: string;
  description: string,
  createdAt: number,
  type: string,
  appliesTo: string,
  value: any
}

export const fetchMetadata = async (): Promise<ScopeMetadata[]> => {
  return await fetch(`${API_BASE}/metadata`).then(
    async (res) => (await res.json()) as ScopeMetadata[]
  );
};

export const fetchEnvs = async (): Promise<ScopeEnv[]> => {
  return await fetch(`${API_BASE}/env`).then(
    async (res) => (await res.json()) as ScopeEnv[]
  );
};

export const fetchAccounts = async () => {
  return await fetch(`${ADMIN_API_BASE}/accounts`).then(
    async (res) => (await res.json()).accounts as Account[]
  );
};

export const fetchProjects = async () => {
  return await fetch(`${ADMIN_API_BASE}/projects`).then(
    async (res) => (await res.json()).projects as Project[]
  );
};

export interface EmailAddress {
  email: string;
  is_primary: boolean;
}

export interface Owner {
  created_at: Date;
  updated_at: Date;
  email_addresses: EmailAddress[];
  id: number;
  account_id: number;
  company: string;
  company_type: string;
  email: string;
  first_name: string;
  invited_by_id?: any;
  is_confirmed: boolean;
  is_email_deliverable: boolean;
  job_title?: any;
  language: string;
  last_name: string;
  phone_number: string;
  photo_url?: any;
  trade_type: string;
  current_sign_in_at: Date;
  in_app_purchase_end_at?: any;
  account_role: string;
  email_notifications: string;
  sync_scheme: string;
}

export interface Account {
  id: number;
  has_tasks_toggle: boolean;
  has_photo_attachments_toggle: boolean;
  company_address?: any;
  company_name: string;
  is_3d_bim_enabled: boolean;
  is_submittals_enabled: boolean;
  is_pm_enabled: boolean;
  invoice_city?: any;
  invoice_country?: any;
  invoice_state?: any;
  invoice_postal_code?: any;
  invoice_country_iso2?: any;
  invoice_email: string;
  invoice_state_iso2?: any;
  has_specs: boolean;
  has_pm: boolean;
  primary_region: string;
  owner: Owner;
}

export interface Project {
  id: string;
  account_id: number;
  box_token_id?: any;
  deleted_by_user_id?: any;
  dropbox_token_id?: any;
  microsoft_token_id?: any;
  sync_id?: any;
  cascade_deleted_by_id?: any;
  has_logo: boolean;
  is_3d_bim_enabled: boolean;
  is_analytics_enabled: boolean;
  is_email_notifications_enabled: boolean;
  is_field_enabled: boolean;
  is_forms_enabled: boolean;
  is_per_project_pricing: boolean;
  is_photo_attachments_enabled: boolean;
  is_plan_email_notifications_enabled: boolean;
  is_pm_enabled: boolean;
  is_sync_exports_enabled: boolean;
  is_sync_photos_enabled: boolean;
  is_task_status_enabled: boolean;
  is_tasks_enabled: boolean;
  prompt_effort_on_complete: boolean;
  access_token: string;
  address?: any;
  cascade_deleted_by_type?: any;
  code?: any;
  color: string;
  currency: string;
  logo_url?: any;
  man_power_units: string;
  name: string;
  sync_path?: any;
  time_zone: string;
  tz_name: string;
  min_api_version?: any;
  mrr?: any;
  active_task_count: number;
  measurement_units: string;
  min_verified_at_days: number;
  sales_attribution?: any;
  sheets_limit?: any;
  task_count: number;
  tasks_sequence_counter: number;
  geo_coordinates?: any;
  archived_at?: any;
  commission_paid_date?: any;
  contract_end_at?: any;
  contract_start_at?: any;
  created_at: Date;
  deleted_at?: any;
  device_created_at: Date;
  device_updated_at: Date;
  invoice_paid_at?: any;
  next_invoice_at?: any;
  sync_last_pushed_at?: any;
  trial_end_at?: any;
  trial_start_at?: any;
  updated_at: Date;
  is_mobile_location_creation_enabled: boolean;
  skip_setting_updated_at: boolean;
  is_plan_text_search_enabled: boolean;
  default_pm_group_id?: any;
  work_week?: any;
  is_submittals_enabled: boolean;
  active_sheets_count: number;
  is_sample_project: boolean;
  has_specs: boolean;
  bubbles_migrated?: any;
}
