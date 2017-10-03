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

ActiveRecord::Schema.define(version: 20171003183504) do

  create_table "agencies", force: :cascade do |t|
    t.string "name", null: false
    t.string "abbrev", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["abbrev"], name: "index_agencies_on_abbrev", unique: true
    t.index ["name"], name: "index_agencies_on_name", unique: true
  end

  create_table "campaign_inputs", force: :cascade do |t|
    t.integer "program_id", null: false
    t.integer "season_id", null: false
    t.integer "campaign_type_id", null: false
    t.string "custom", null: false
    t.integer "start_month", null: false
    t.integer "start_day", null: false
    t.integer "start_year", null: false
    t.integer "end_month", null: false
    t.integer "end_day", null: false
    t.integer "end_year", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campaign_type_id"], name: "index_campaign_inputs_on_campaign_type_id"
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

  create_table "campaigns", force: :cascade do |t|
    t.string "name", null: false
    t.string "abbrev", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["abbrev"], name: "index_campaigns_on_abbrev", unique: true
    t.index ["name"], name: "index_campaigns_on_name", unique: true
  end

  create_table "networks", force: :cascade do |t|
    t.string "name", null: false
    t.string "abbrev", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["abbrev"], name: "index_networks_on_abbrev", unique: true
    t.index ["name"], name: "index_networks_on_name", unique: true
  end

  create_table "programs", force: :cascade do |t|
    t.string "name", null: false
    t.string "abbrev", null: false
    t.integer "network_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["abbrev"], name: "index_programs_on_abbrev", unique: true
    t.index ["name"], name: "index_programs_on_name", unique: true
    t.index ["network_id"], name: "index_programs_on_network_id"
  end

  create_table "seasons", force: :cascade do |t|
    t.string "name", null: false
    t.string "abbrev", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["abbrev"], name: "index_seasons_on_abbrev", unique: true
    t.index ["name"], name: "index_seasons_on_name", unique: true
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
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["invitation_token"], name: "index_users_on_invitation_token", unique: true
    t.index ["invitations_count"], name: "index_users_on_invitations_count"
    t.index ["invited_by_id"], name: "index_users_on_invited_by_id"
    t.index ["invited_by_type", "invited_by_id"], name: "index_users_on_invited_by_type_and_invited_by_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end
