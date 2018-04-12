# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180411232858) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "abtest_labels", force: :cascade do |t|
    t.string "name", null: false
    t.string "abbrev", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["abbrev"], name: "index_abtest_labels_on_abbrev", unique: true
    t.index ["name"], name: "index_abtest_labels_on_name", unique: true
  end

  create_table "ad_inputs", force: :cascade do |t|
    t.bigint "placement_input_id"
    t.bigint "creative_group_id"
    t.string "custom", null: false
    t.string "ad_input_tag", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "lock_version"
    t.index ["creative_group_id"], name: "index_ad_inputs_on_creative_group_id"
    t.index ["placement_input_id"], name: "index_ad_inputs_on_placement_input_id"
  end

  create_table "ad_types", force: :cascade do |t|
    t.string "name", null: false
    t.string "abbrev", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["abbrev"], name: "index_ad_types_on_abbrev", unique: true
    t.index ["name"], name: "index_ad_types_on_name", unique: true
  end

  create_table "agencies", force: :cascade do |t|
    t.string "name", null: false
    t.string "abbrev", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["abbrev"], name: "index_agencies_on_abbrev", unique: true
    t.index ["name"], name: "index_agencies_on_name", unique: true
  end

  create_table "buy_methods", force: :cascade do |t|
    t.string "name", null: false
    t.string "abbrev", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["abbrev"], name: "index_buy_methods_on_abbrev", unique: true
    t.index ["name"], name: "index_buy_methods_on_name", unique: true
  end

  create_table "campaign_inputs", force: :cascade do |t|
    t.bigint "program_id", null: false
    t.bigint "network_id", null: false
    t.bigint "season_id", null: false
    t.bigint "campaign_type_id", null: false
    t.string "custom", null: false
    t.string "start_month", null: false
    t.string "start_day", null: false
    t.integer "start_year", null: false
    t.string "end_month", null: false
    t.string "end_day", null: false
    t.integer "end_year", null: false
    t.string "campaign_input_tag", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "lock_version"
    t.index ["campaign_type_id"], name: "index_campaign_inputs_on_campaign_type_id"
    t.index ["network_id"], name: "index_campaign_inputs_on_network_id"
    t.index ["program_id"], name: "index_campaign_inputs_on_program_id"
    t.index ["season_id"], name: "index_campaign_inputs_on_season_id"
  end

  create_table "campaign_types", force: :cascade do |t|
    t.string "name", null: false
    t.string "abbrev", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["abbrev"], name: "index_campaign_types_on_abbrev", unique: true
    t.index ["name"], name: "index_campaign_types_on_name", unique: true
  end

  create_table "creative_groups", force: :cascade do |t|
    t.string "name", null: false
    t.string "abbrev", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["abbrev"], name: "index_creative_groups_on_abbrev", unique: true
    t.index ["name"], name: "index_creative_groups_on_name", unique: true
  end

  create_table "creative_inputs", force: :cascade do |t|
    t.bigint "ad_input_id"
    t.bigint "creative_message_id"
    t.bigint "abtest_label_id"
    t.bigint "video_length_id"
    t.string "start_month", null: false
    t.string "start_day", null: false
    t.string "end_month", null: false
    t.string "end_day", null: false
    t.string "creative_input_tag", null: false
    t.string "custom"
    t.string "creative_version_number", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "start_year", default: 2017, null: false
    t.integer "end_year", default: 2017, null: false
    t.integer "lock_version"
    t.index ["abtest_label_id"], name: "index_creative_inputs_on_abtest_label_id"
    t.index ["ad_input_id"], name: "index_creative_inputs_on_ad_input_id"
    t.index ["creative_message_id"], name: "index_creative_inputs_on_creative_message_id"
    t.index ["video_length_id"], name: "index_creative_inputs_on_video_length_id"
  end

  create_table "creative_messages", force: :cascade do |t|
    t.string "name", null: false
    t.string "abbrev", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["abbrev"], name: "index_creative_messages_on_abbrev", unique: true
    t.index ["name"], name: "index_creative_messages_on_name", unique: true
  end

  create_table "devices", force: :cascade do |t|
    t.string "name", null: false
    t.string "abbrev", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["abbrev"], name: "index_devices_on_abbrev", unique: true
    t.index ["name"], name: "index_devices_on_name", unique: true
  end

  create_table "episodes", force: :cascade do |t|
    t.string "name", null: false
    t.string "abbrev", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["abbrev"], name: "index_episodes_on_abbrev", unique: true
    t.index ["name"], name: "index_episodes_on_name", unique: true
  end

  create_table "inventory_types", force: :cascade do |t|
    t.string "name", null: false
    t.string "abbrev", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["abbrev"], name: "index_inventory_types_on_abbrev", unique: true
    t.index ["name"], name: "index_inventory_types_on_name", unique: true
  end

  create_table "networks", force: :cascade do |t|
    t.string "name", null: false
    t.string "abbrev", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["abbrev"], name: "index_networks_on_abbrev", unique: true
    t.index ["name"], name: "index_networks_on_name", unique: true
  end

  create_table "package_inputs", force: :cascade do |t|
    t.bigint "campaign_input_id", null: false
    t.bigint "agency_id", null: false
    t.bigint "publisher_id", null: false
    t.bigint "buy_method_id", null: false
    t.bigint "inventory_type_id", null: false
    t.string "custom", null: false
    t.string "package_input_tag", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "lock_version"
    t.index ["agency_id"], name: "index_package_inputs_on_agency_id"
    t.index ["buy_method_id"], name: "index_package_inputs_on_buy_method_id"
    t.index ["campaign_input_id"], name: "index_package_inputs_on_campaign_input_id"
    t.index ["inventory_type_id"], name: "index_package_inputs_on_inventory_type_id"
    t.index ["publisher_id"], name: "index_package_inputs_on_publisher_id"
  end

  create_table "placement_inputs", force: :cascade do |t|
    t.string "placement_input_tag", null: false
    t.string "tentpole_details"
    t.bigint "tactic_id", null: false
    t.bigint "device_id", null: false
    t.bigint "ad_type_id", null: false
    t.string "audience_type", null: false
    t.integer "width"
    t.integer "height"
    t.bigint "package_input_id", null: false
    t.bigint "targeting_type_1_id"
    t.bigint "targeting_type_2_id"
    t.bigint "targeting_type_3_id"
    t.bigint "targeting_type_4_id"
    t.bigint "episode_start_id"
    t.bigint "episode_end_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "lock_version"
    t.index ["ad_type_id"], name: "index_placement_inputs_on_ad_type_id"
    t.index ["device_id"], name: "index_placement_inputs_on_device_id"
    t.index ["episode_end_id"], name: "index_placement_inputs_on_episode_end_id"
    t.index ["episode_start_id"], name: "index_placement_inputs_on_episode_start_id"
    t.index ["package_input_id"], name: "index_placement_inputs_on_package_input_id"
    t.index ["tactic_id"], name: "index_placement_inputs_on_tactic_id"
    t.index ["targeting_type_1_id"], name: "index_placement_inputs_on_targeting_type_1_id"
    t.index ["targeting_type_2_id"], name: "index_placement_inputs_on_targeting_type_2_id"
    t.index ["targeting_type_3_id"], name: "index_placement_inputs_on_targeting_type_3_id"
    t.index ["targeting_type_4_id"], name: "index_placement_inputs_on_targeting_type_4_id"
  end

  create_table "programs", force: :cascade do |t|
    t.string "name", null: false
    t.string "abbrev", null: false
    t.bigint "network_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["network_id", "abbrev"], name: "index_programs_on_network_id_and_abbrev", unique: true
    t.index ["network_id", "name"], name: "index_programs_on_network_id_and_name", unique: true
    t.index ["network_id"], name: "index_programs_on_network_id"
  end

  create_table "publishers", force: :cascade do |t|
    t.string "name", null: false
    t.string "abbrev", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["abbrev"], name: "index_publishers_on_abbrev", unique: true
    t.index ["name"], name: "index_publishers_on_name", unique: true
  end

  create_table "requests", force: :cascade do |t|
    t.string "requestor", null: false
    t.string "administrator"
    t.string "brand", null: false
    t.string "dimension", null: false
    t.string "dimension_value", null: false
    t.text "additional_info"
    t.string "status", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "seasons", force: :cascade do |t|
    t.string "name", null: false
    t.string "abbrev", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["abbrev"], name: "index_seasons_on_abbrev", unique: true
    t.index ["name"], name: "index_seasons_on_name", unique: true
  end

  create_table "tactics", force: :cascade do |t|
    t.string "name", null: false
    t.string "abbrev", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["abbrev"], name: "index_tactics_on_abbrev", unique: true
    t.index ["name"], name: "index_tactics_on_name", unique: true
  end

  create_table "targeting_types", force: :cascade do |t|
    t.string "name", null: false
    t.string "abbrev", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["abbrev"], name: "index_targeting_types_on_abbrev", unique: true
    t.index ["name"], name: "index_targeting_types_on_name", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.boolean "admin", default: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "invitation_token"
    t.datetime "invitation_created_at"
    t.datetime "invitation_sent_at"
    t.datetime "invitation_accepted_at"
    t.integer "invitation_limit"
    t.string "invited_by_type"
    t.integer "invited_by_id"
    t.integer "invitations_count", default: 0
    t.bigint "agency_id"
    t.index ["agency_id"], name: "index_users_on_agency_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["invitation_token"], name: "index_users_on_invitation_token", unique: true
    t.index ["invitations_count"], name: "index_users_on_invitations_count"
    t.index ["invited_by_id"], name: "index_users_on_invited_by_id"
    t.index ["invited_by_type", "invited_by_id"], name: "index_users_on_invited_by_type_and_invited_by_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "video_lengths", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_video_lengths_on_name", unique: true
  end

  add_foreign_key "ad_inputs", "creative_groups"
  add_foreign_key "ad_inputs", "placement_inputs", on_delete: :cascade
  add_foreign_key "campaign_inputs", "campaign_types"
  add_foreign_key "campaign_inputs", "networks"
  add_foreign_key "campaign_inputs", "programs"
  add_foreign_key "campaign_inputs", "seasons"
  add_foreign_key "creative_inputs", "abtest_labels"
  add_foreign_key "creative_inputs", "ad_inputs", on_delete: :cascade
  add_foreign_key "creative_inputs", "creative_messages"
  add_foreign_key "creative_inputs", "video_lengths"
  add_foreign_key "package_inputs", "agencies"
  add_foreign_key "package_inputs", "buy_methods"
  add_foreign_key "package_inputs", "campaign_inputs", on_delete: :cascade
  add_foreign_key "package_inputs", "inventory_types"
  add_foreign_key "package_inputs", "publishers"
  add_foreign_key "placement_inputs", "ad_types"
  add_foreign_key "placement_inputs", "devices"
  add_foreign_key "placement_inputs", "episodes", column: "episode_end_id"
  add_foreign_key "placement_inputs", "episodes", column: "episode_start_id"
  add_foreign_key "placement_inputs", "package_inputs", on_delete: :cascade
  add_foreign_key "placement_inputs", "tactics"
  add_foreign_key "placement_inputs", "targeting_types", column: "targeting_type_1_id"
  add_foreign_key "placement_inputs", "targeting_types", column: "targeting_type_2_id"
  add_foreign_key "placement_inputs", "targeting_types", column: "targeting_type_3_id"
  add_foreign_key "placement_inputs", "targeting_types", column: "targeting_type_4_id"
  add_foreign_key "programs", "networks"
  add_foreign_key "users", "agencies"
end
