
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "public": {
          Tables: {
            "agreements": {
                  Row: {
                    "completed_at": string | null,"created_at": string,"envelope_id": string | null,"id": string,"locale": string,"sent_at": string | null,"signer_person_id": string,"status": string,"subject_person_id": string,"template_id": string,"template_version": string,"type": string,"updated_at": string,"valid_until": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "completed_at"?: string | null,"created_at"?: string,"envelope_id"?: string | null,"id"?: string,"locale"?: string,"sent_at"?: string | null,"signer_person_id": string,"status"?: string,"subject_person_id": string,"template_id": string,"template_version": string,"type": string,"updated_at"?: string,"valid_until"?: string | null
                  }
                  Update: {
                    "completed_at"?: string | null,"created_at"?: string,"envelope_id"?: string | null,"id"?: string,"locale"?: string,"sent_at"?: string | null,"signer_person_id"?: string,"status"?: string,"subject_person_id"?: string,"template_id"?: string,"template_version"?: string,"type"?: string,"updated_at"?: string,"valid_until"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "agreements_signer_person_id_fkey"
      columns: ["signer_person_id"]
isOneToOne: false
      referencedRelation: "people"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "agreements_subject_person_id_fkey"
      columns: ["subject_person_id"]
isOneToOne: false
      referencedRelation: "people"
      referencedColumns: ["id"]
    }
                  ]
                },"audit_log": {
                  Row: {
                    "action": string,"actor_kind": string,"actor_staff_id": string | null,"after": Json | null,"at": string,"before": Json | null,"created_at": string,"id": string,"target_id": string | null,"target_type": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "action": string,"actor_kind"?: string,"actor_staff_id"?: string | null,"after"?: Json | null,"at"?: string,"before"?: Json | null,"created_at"?: string,"id"?: string,"target_id"?: string | null,"target_type": string,"updated_at"?: string
                  }
                  Update: {
                    "action"?: string,"actor_kind"?: string,"actor_staff_id"?: string | null,"after"?: Json | null,"at"?: string,"before"?: Json | null,"created_at"?: string,"id"?: string,"target_id"?: string | null,"target_type"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "audit_log_actor_staff_id_fkey"
      columns: ["actor_staff_id"]
isOneToOne: false
      referencedRelation: "staff_users"
      referencedColumns: ["id"]
    }
                  ]
                },"campaign_links": {
                  Row: {
                    "created_at": string,"created_by": string | null,"event_id": string | null,"id": string,"placement": string,"updated_at": string,"url": string,"utm_campaign": string,"utm_content": string | null,"utm_medium": string,"utm_source": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"created_by"?: string | null,"event_id"?: string | null,"id"?: string,"placement": string,"updated_at"?: string,"url": string,"utm_campaign": string,"utm_content"?: string | null,"utm_medium": string,"utm_source": string
                  }
                  Update: {
                    "created_at"?: string,"created_by"?: string | null,"event_id"?: string | null,"id"?: string,"placement"?: string,"updated_at"?: string,"url"?: string,"utm_campaign"?: string,"utm_content"?: string | null,"utm_medium"?: string,"utm_source"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "campaign_links_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "staff_users"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "campaign_links_event_id_fkey"
      columns: ["event_id"]
isOneToOne: false
      referencedRelation: "events"
      referencedColumns: ["id"]
    }
                  ]
                },"check_ins": {
                  Row: {
                    "checked_in_at": string,"checked_in_by": string | null,"created_at": string,"id": string,"registration_id": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "checked_in_at"?: string,"checked_in_by"?: string | null,"created_at"?: string,"id"?: string,"registration_id": string,"updated_at"?: string
                  }
                  Update: {
                    "checked_in_at"?: string,"checked_in_by"?: string | null,"created_at"?: string,"id"?: string,"registration_id"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "check_ins_checked_in_by_fkey"
      columns: ["checked_in_by"]
isOneToOne: false
      referencedRelation: "staff_users"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "check_ins_registration_id_fkey"
      columns: ["registration_id"]
isOneToOne: true
      referencedRelation: "volunteer_registrations"
      referencedColumns: ["id"]
    }
                  ]
                },"event_publications": {
                  Row: {
                    "created_at": string,"event_id": string,"external_id": string | null,"external_url": string | null,"id": string,"last_error": string | null,"last_published_at": string | null,"platform": string,"status": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"event_id": string,"external_id"?: string | null,"external_url"?: string | null,"id"?: string,"last_error"?: string | null,"last_published_at"?: string | null,"platform": string,"status"?: string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"event_id"?: string,"external_id"?: string | null,"external_url"?: string | null,"id"?: string,"last_error"?: string | null,"last_published_at"?: string | null,"platform"?: string,"status"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "event_publications_event_id_fkey"
      columns: ["event_id"]
isOneToOne: false
      referencedRelation: "events"
      referencedColumns: ["id"]
    }
                  ]
                },"event_shifts": {
                  Row: {
                    "capacity": number,"created_at": string,"ends_at": string,"event_id": string,"id": string,"label": string,"starts_at": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "capacity": number,"created_at"?: string,"ends_at": string,"event_id": string,"id"?: string,"label": string,"starts_at": string,"updated_at"?: string
                  }
                  Update: {
                    "capacity"?: number,"created_at"?: string,"ends_at"?: string,"event_id"?: string,"id"?: string,"label"?: string,"starts_at"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "event_shifts_event_id_fkey"
      columns: ["event_id"]
isOneToOne: false
      referencedRelation: "events"
      referencedColumns: ["id"]
    }
                  ]
                },"event_texts": {
                  Row: {
                    "accessibility": string | null,"created_at": string,"description": string | null,"event_id": string,"guest_bring": string | null,"guest_cost": string | null,"guest_who": string | null,"id": string,"locale": string,"machine_translated": boolean,"source_hash": string | null,"summary": string | null,"title": string,"updated_at": string,"volunteer_expect": string | null,"volunteer_wear": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "accessibility"?: string | null,"created_at"?: string,"description"?: string | null,"event_id": string,"guest_bring"?: string | null,"guest_cost"?: string | null,"guest_who"?: string | null,"id"?: string,"locale": string,"machine_translated"?: boolean,"source_hash"?: string | null,"summary"?: string | null,"title": string,"updated_at"?: string,"volunteer_expect"?: string | null,"volunteer_wear"?: string | null
                  }
                  Update: {
                    "accessibility"?: string | null,"created_at"?: string,"description"?: string | null,"event_id"?: string,"guest_bring"?: string | null,"guest_cost"?: string | null,"guest_who"?: string | null,"id"?: string,"locale"?: string,"machine_translated"?: boolean,"source_hash"?: string | null,"summary"?: string | null,"title"?: string,"updated_at"?: string,"volunteer_expect"?: string | null,"volunteer_wear"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "event_texts_event_id_fkey"
      columns: ["event_id"]
isOneToOne: false
      referencedRelation: "events"
      referencedColumns: ["id"]
    }
                  ]
                },"events": {
                  Row: {
                    "accompany_under_age": number,"address": string | null,"created_at": string,"created_by": string | null,"cutoff_offset": string,"ends_at": string,"hero_image_asset": Json | null,"id": string,"languages": (string)[],"min_age": number | null,"need_categories": (string)[],"open_to_public": boolean,"ownership": string,"partner_name": string | null,"partner_signup_url": string | null,"program_key": string | null,"published_at": string | null,"required_agreements": (string)[],"slug": string,"starts_at": string,"status": string,"timezone": string,"updated_at": string,"venue_name": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "accompany_under_age"?: number,"address"?: string | null,"created_at"?: string,"created_by"?: string | null,"cutoff_offset"?: string,"ends_at": string,"hero_image_asset"?: Json | null,"id"?: string,"languages"?: (string)[],"min_age"?: number | null,"need_categories"?: (string)[],"open_to_public"?: boolean,"ownership"?: string,"partner_name"?: string | null,"partner_signup_url"?: string | null,"program_key"?: string | null,"published_at"?: string | null,"required_agreements"?: (string)[],"slug": string,"starts_at": string,"status"?: string,"timezone"?: string,"updated_at"?: string,"venue_name"?: string | null
                  }
                  Update: {
                    "accompany_under_age"?: number,"address"?: string | null,"created_at"?: string,"created_by"?: string | null,"cutoff_offset"?: string,"ends_at"?: string,"hero_image_asset"?: Json | null,"id"?: string,"languages"?: (string)[],"min_age"?: number | null,"need_categories"?: (string)[],"open_to_public"?: boolean,"ownership"?: string,"partner_name"?: string | null,"partner_signup_url"?: string | null,"program_key"?: string | null,"published_at"?: string | null,"required_agreements"?: (string)[],"slug"?: string,"starts_at"?: string,"status"?: string,"timezone"?: string,"updated_at"?: string,"venue_name"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "events_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "staff_users"
      referencedColumns: ["id"]
    }
                  ]
                },"inquiries": {
                  Row: {
                    "created_at": string,"id": string,"message": string | null,"owner_staff_id": string | null,"person_id": string | null,"preferred_contact": string | null,"status": string,"type": string,"updated_at": string,"utm_campaign": string | null,"utm_content": string | null,"utm_medium": string | null,"utm_source": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"message"?: string | null,"owner_staff_id"?: string | null,"person_id"?: string | null,"preferred_contact"?: string | null,"status"?: string,"type": string,"updated_at"?: string,"utm_campaign"?: string | null,"utm_content"?: string | null,"utm_medium"?: string | null,"utm_source"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"message"?: string | null,"owner_staff_id"?: string | null,"person_id"?: string | null,"preferred_contact"?: string | null,"status"?: string,"type"?: string,"updated_at"?: string,"utm_campaign"?: string | null,"utm_content"?: string | null,"utm_medium"?: string | null,"utm_source"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "inquiries_owner_staff_id_fkey"
      columns: ["owner_staff_id"]
isOneToOne: false
      referencedRelation: "staff_users"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "inquiries_person_id_fkey"
      columns: ["person_id"]
isOneToOne: false
      referencedRelation: "people"
      referencedColumns: ["id"]
    }
                  ]
                },"intake_review": {
                  Row: {
                    "candidate_person_ids": (string)[],"created_at": string,"external_ref": string | null,"id": string,"resolved_by": string | null,"source": string,"status": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "candidate_person_ids"?: (string)[],"created_at"?: string,"external_ref"?: string | null,"id"?: string,"resolved_by"?: string | null,"source": string,"status"?: string,"updated_at"?: string
                  }
                  Update: {
                    "candidate_person_ids"?: (string)[],"created_at"?: string,"external_ref"?: string | null,"id"?: string,"resolved_by"?: string | null,"source"?: string,"status"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "intake_review_resolved_by_fkey"
      columns: ["resolved_by"]
isOneToOne: false
      referencedRelation: "staff_users"
      referencedColumns: ["id"]
    }
                  ]
                },"integration_events": {
                  Row: {
                    "attempts": number,"created_at": string,"error": string | null,"external_event_id": string,"id": string,"processed_at": string | null,"provider": string,"received_at": string,"status": string,"type": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "attempts"?: number,"created_at"?: string,"error"?: string | null,"external_event_id": string,"id"?: string,"processed_at"?: string | null,"provider": string,"received_at"?: string,"status"?: string,"type": string,"updated_at"?: string
                  }
                  Update: {
                    "attempts"?: number,"created_at"?: string,"error"?: string | null,"external_event_id"?: string,"id"?: string,"processed_at"?: string | null,"provider"?: string,"received_at"?: string,"status"?: string,"type"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"job_runs": {
                  Row: {
                    "created_at": string,"finished_at": string | null,"id": string,"job": string,"started_at": string,"status": string,"summary": Json | null,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"finished_at"?: string | null,"id"?: string,"job": string,"started_at"?: string,"status"?: string,"summary"?: Json | null,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"finished_at"?: string | null,"id"?: string,"job"?: string,"started_at"?: string,"status"?: string,"summary"?: Json | null,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"link_tokens": {
                  Row: {
                    "created_at": string,"expires_at": string,"id": string,"purpose": string,"revoked_at": string | null,"subject_id": string,"subject_type": string,"token_hash": string,"updated_at": string,"used_at": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"expires_at": string,"id"?: string,"purpose": string,"revoked_at"?: string | null,"subject_id": string,"subject_type": string,"token_hash": string,"updated_at"?: string,"used_at"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"expires_at"?: string,"id"?: string,"purpose"?: string,"revoked_at"?: string | null,"subject_id"?: string,"subject_type"?: string,"token_hash"?: string,"updated_at"?: string,"used_at"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"payments": {
                  Row: {
                    "amount_cents": number,"created_at": string,"designation": string | null,"fee_covered_cents": number,"id": string,"kind": string,"person_id": string | null,"provider": string,"provider_ref": string,"public_ref": string,"status": string,"tribute_name": string | null,"tribute_type": string | null,"updated_at": string,"utm_campaign": string | null,"utm_content": string | null,"utm_medium": string | null,"utm_source": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "amount_cents": number,"created_at"?: string,"designation"?: string | null,"fee_covered_cents"?: number,"id"?: string,"kind": string,"person_id"?: string | null,"provider": string,"provider_ref": string,"public_ref"?: string,"status"?: string,"tribute_name"?: string | null,"tribute_type"?: string | null,"updated_at"?: string,"utm_campaign"?: string | null,"utm_content"?: string | null,"utm_medium"?: string | null,"utm_source"?: string | null
                  }
                  Update: {
                    "amount_cents"?: number,"created_at"?: string,"designation"?: string | null,"fee_covered_cents"?: number,"id"?: string,"kind"?: string,"person_id"?: string | null,"provider"?: string,"provider_ref"?: string,"public_ref"?: string,"status"?: string,"tribute_name"?: string | null,"tribute_type"?: string | null,"updated_at"?: string,"utm_campaign"?: string | null,"utm_content"?: string | null,"utm_medium"?: string | null,"utm_source"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "payments_person_id_fkey"
      columns: ["person_id"]
isOneToOne: false
      referencedRelation: "people"
      referencedColumns: ["id"]
    }
                  ]
                },"people": {
                  Row: {
                    "birth_year": number | null,"created_at": string,"email": string | null,"first_name": string,"id": string,"last_activity_at": string | null,"last_name": string,"phone": string | null,"preferred_locale": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "birth_year"?: number | null,"created_at"?: string,"email"?: string | null,"first_name": string,"id"?: string,"last_activity_at"?: string | null,"last_name": string,"phone"?: string | null,"preferred_locale"?: string,"updated_at"?: string
                  }
                  Update: {
                    "birth_year"?: number | null,"created_at"?: string,"email"?: string | null,"first_name"?: string,"id"?: string,"last_activity_at"?: string | null,"last_name"?: string,"phone"?: string | null,"preferred_locale"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"rate_limits": {
                  Row: {
                    "created_at": string,"expires_at": string,"hits": number,"id": string,"key": string,"updated_at": string,"window_start": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"expires_at": string,"hits"?: number,"id"?: string,"key": string,"updated_at"?: string,"window_start": string
                  }
                  Update: {
                    "created_at"?: string,"expires_at"?: string,"hits"?: number,"id"?: string,"key"?: string,"updated_at"?: string,"window_start"?: string
                  }
                  Relationships: [
                    
                  ]
                },"registration_shifts": {
                  Row: {
                    "created_at": string,"event_id": string,"id": string,"registration_id": string,"shift_id": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"event_id": string,"id"?: string,"registration_id": string,"shift_id": string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"event_id"?: string,"id"?: string,"registration_id"?: string,"shift_id"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "registration_shifts_registration_id_event_id_fkey"
      columns: ["registration_id","event_id"]
isOneToOne: false
      referencedRelation: "volunteer_registrations"
      referencedColumns: ["id","event_id"]
    },{
      foreignKeyName: "registration_shifts_shift_id_event_id_fkey"
      columns: ["shift_id","event_id"]
isOneToOne: false
      referencedRelation: "event_shifts"
      referencedColumns: ["id","event_id"]
    }
                  ]
                },"registration_status_history": {
                  Row: {
                    "actor_kind": string,"actor_staff_id": string | null,"created_at": string,"from_status": string | null,"id": string,"reason": string | null,"registration_id": string,"to_status": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "actor_kind": string,"actor_staff_id"?: string | null,"created_at"?: string,"from_status"?: string | null,"id"?: string,"reason"?: string | null,"registration_id": string,"to_status": string,"updated_at"?: string
                  }
                  Update: {
                    "actor_kind"?: string,"actor_staff_id"?: string | null,"created_at"?: string,"from_status"?: string | null,"id"?: string,"reason"?: string | null,"registration_id"?: string,"to_status"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "registration_status_history_actor_staff_id_fkey"
      columns: ["actor_staff_id"]
isOneToOne: false
      referencedRelation: "staff_users"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "registration_status_history_registration_id_fkey"
      columns: ["registration_id"]
isOneToOne: false
      referencedRelation: "volunteer_registrations"
      referencedColumns: ["id"]
    }
                  ]
                },"staff_permissions": {
                  Row: {
                    "created_at": string,"granted_at": string,"granted_by": string | null,"id": string,"permission_key": string,"staff_id": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"granted_at"?: string,"granted_by"?: string | null,"id"?: string,"permission_key": string,"staff_id": string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"granted_at"?: string,"granted_by"?: string | null,"id"?: string,"permission_key"?: string,"staff_id"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "staff_permissions_granted_by_fkey"
      columns: ["granted_by"]
isOneToOne: false
      referencedRelation: "staff_users"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "staff_permissions_staff_id_fkey"
      columns: ["staff_id"]
isOneToOne: false
      referencedRelation: "staff_users"
      referencedColumns: ["id"]
    }
                  ]
                },"staff_users": {
                  Row: {
                    "active": boolean,"auth_user_id": string | null,"created_at": string,"email": string,"id": string,"is_admin": boolean,"last_sign_in_at": string | null,"name": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "active"?: boolean,"auth_user_id"?: string | null,"created_at"?: string,"email": string,"id"?: string,"is_admin"?: boolean,"last_sign_in_at"?: string | null,"name": string,"updated_at"?: string
                  }
                  Update: {
                    "active"?: boolean,"auth_user_id"?: string | null,"created_at"?: string,"email"?: string,"id"?: string,"is_admin"?: boolean,"last_sign_in_at"?: string | null,"name"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"store_order_items": {
                  Row: {
                    "created_at": string,"id": string,"order_id": string,"product_id": string,"quantity": number,"size": string | null,"title": string,"unit_price_cents": number,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"order_id": string,"product_id": string,"quantity": number,"size"?: string | null,"title": string,"unit_price_cents": number,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"order_id"?: string,"product_id"?: string,"quantity"?: number,"size"?: string | null,"title"?: string,"unit_price_cents"?: number,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "store_order_items_order_id_fkey"
      columns: ["order_id"]
isOneToOne: false
      referencedRelation: "store_orders"
      referencedColumns: ["id"]
    }
                  ]
                },"store_orders": {
                  Row: {
                    "contact_email": string | null,"contact_name": string | null,"contact_phone": string | null,"created_at": string,"fee_cents": number,"id": string,"provider": string,"provider_ref": string,"shipping_cents": number,"shipping_city": string | null,"shipping_country": string | null,"shipping_line1": string | null,"shipping_line2": string | null,"shipping_postal_code": string | null,"shipping_state": string | null,"status": string,"subtotal_cents": number,"tax_cents": number,"total_cents": number,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "contact_email"?: string | null,"contact_name"?: string | null,"contact_phone"?: string | null,"created_at"?: string,"fee_cents"?: number,"id"?: string,"provider": string,"provider_ref": string,"shipping_cents"?: number,"shipping_city"?: string | null,"shipping_country"?: string | null,"shipping_line1"?: string | null,"shipping_line2"?: string | null,"shipping_postal_code"?: string | null,"shipping_state"?: string | null,"status"?: string,"subtotal_cents": number,"tax_cents"?: number,"total_cents": number,"updated_at"?: string
                  }
                  Update: {
                    "contact_email"?: string | null,"contact_name"?: string | null,"contact_phone"?: string | null,"created_at"?: string,"fee_cents"?: number,"id"?: string,"provider"?: string,"provider_ref"?: string,"shipping_cents"?: number,"shipping_city"?: string | null,"shipping_country"?: string | null,"shipping_line1"?: string | null,"shipping_line2"?: string | null,"shipping_postal_code"?: string | null,"shipping_state"?: string | null,"status"?: string,"subtotal_cents"?: number,"tax_cents"?: number,"total_cents"?: number,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"subscriptions": {
                  Row: {
                    "amount_cents": number,"business_name": string | null,"created_at": string,"id": string,"kind": string,"logo_listing_consent": boolean,"person_id": string | null,"provider": string,"provider_ref": string,"status": string,"tier_key": string | null,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "amount_cents": number,"business_name"?: string | null,"created_at"?: string,"id"?: string,"kind": string,"logo_listing_consent"?: boolean,"person_id"?: string | null,"provider": string,"provider_ref": string,"status"?: string,"tier_key"?: string | null,"updated_at"?: string
                  }
                  Update: {
                    "amount_cents"?: number,"business_name"?: string | null,"created_at"?: string,"id"?: string,"kind"?: string,"logo_listing_consent"?: boolean,"person_id"?: string | null,"provider"?: string,"provider_ref"?: string,"status"?: string,"tier_key"?: string | null,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "subscriptions_person_id_fkey"
      columns: ["person_id"]
isOneToOne: false
      referencedRelation: "people"
      referencedColumns: ["id"]
    }
                  ]
                },"translation_cache": {
                  Row: {
                    "created_at": string,"glossary_version": string,"id": string,"provider": string,"source_hash": string,"source_locale": string,"target_locale": string,"text": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"glossary_version": string,"id"?: string,"provider": string,"source_hash": string,"source_locale": string,"target_locale": string,"text": string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"glossary_version"?: string,"id"?: string,"provider"?: string,"source_hash"?: string,"source_locale"?: string,"target_locale"?: string,"text"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"volunteer_parties": {
                  Row: {
                    "created_at": string,"event_id": string,"eventbrite_order_id": string | null,"id": string,"landing_path": string | null,"registrant_person_id": string,"source": string,"updated_at": string,"utm_campaign": string | null,"utm_content": string | null,"utm_medium": string | null,"utm_source": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"event_id": string,"eventbrite_order_id"?: string | null,"id"?: string,"landing_path"?: string | null,"registrant_person_id": string,"source"?: string,"updated_at"?: string,"utm_campaign"?: string | null,"utm_content"?: string | null,"utm_medium"?: string | null,"utm_source"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"event_id"?: string,"eventbrite_order_id"?: string | null,"id"?: string,"landing_path"?: string | null,"registrant_person_id"?: string,"source"?: string,"updated_at"?: string,"utm_campaign"?: string | null,"utm_content"?: string | null,"utm_medium"?: string | null,"utm_source"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "volunteer_parties_event_id_fkey"
      columns: ["event_id"]
isOneToOne: false
      referencedRelation: "events"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "volunteer_parties_registrant_person_id_fkey"
      columns: ["registrant_person_id"]
isOneToOne: false
      referencedRelation: "people"
      referencedColumns: ["id"]
    }
                  ]
                },"volunteer_registrations": {
                  Row: {
                    "created_at": string,"event_id": string,"eventbrite_attendee_id": string | null,"exception_reason": string | null,"guardian_person_id": string | null,"id": string,"is_minor": boolean,"party_id": string,"person_id": string,"photo_consent": boolean | null,"status": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"event_id": string,"eventbrite_attendee_id"?: string | null,"exception_reason"?: string | null,"guardian_person_id"?: string | null,"id"?: string,"is_minor"?: boolean,"party_id": string,"person_id": string,"photo_consent"?: boolean | null,"status": string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"event_id"?: string,"eventbrite_attendee_id"?: string | null,"exception_reason"?: string | null,"guardian_person_id"?: string | null,"id"?: string,"is_minor"?: boolean,"party_id"?: string,"person_id"?: string,"photo_consent"?: boolean | null,"status"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "volunteer_registrations_event_id_fkey"
      columns: ["event_id"]
isOneToOne: false
      referencedRelation: "events"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "volunteer_registrations_guardian_person_id_fkey"
      columns: ["guardian_person_id"]
isOneToOne: false
      referencedRelation: "people"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "volunteer_registrations_party_id_event_id_fkey"
      columns: ["party_id","event_id"]
isOneToOne: false
      referencedRelation: "volunteer_parties"
      referencedColumns: ["id","event_id"]
    },{
      foreignKeyName: "volunteer_registrations_person_id_fkey"
      columns: ["person_id"]
isOneToOne: false
      referencedRelation: "people"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "rate_limit_hit":
{ Args: { "p_key": string,"p_window_seconds": number,"p_window_start": string }; Returns: number
                           },
"shift_spots_taken":
{ Args: { "p_event_ids": (string)[] }; Returns: {
              "shift_id": string,"taken": number
            }[]
                           },
"webhook_claim":
{ Args: { "p_external_event_id": string,"p_provider": string,"p_type": string }; Returns: {
              "attempts": number,"is_new": boolean,"status": string
            }[]
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "public": {
          Enums: {
            
          }
        }
} as const
