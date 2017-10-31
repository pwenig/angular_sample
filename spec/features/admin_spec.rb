require 'rails_helper'

RSpec.feature 'Admin', type: :feature do
  before do
    visit('/')
    @admin = User.create(email: 'admin@admin.com', password: 'password', admin: true)
    @user = FactoryGirl.create(:user)
  end

  it 'redirects a non-admin user' do
    fill_in('email-login', with: @user.email)
    fill_in('password-login', with: @user.password)
    click_on('Log In')
    expect(current_path).to_not eq(admin_root_path)
    expect(current_path).to eq(root_path)
    visit('/admin')
    expect(page).to have_text('You are not authorized to access this page.')
  end

  it 'logs in an admin user' do
    fill_in('email-login', with: @admin.email)
    fill_in('password-login', with: @admin.password)
    click_on('Log In')
    expect(current_path).to eq(admin_root_path)
  end

  it 'directs to user admin' do
    fill_in('email-login', with: @admin.email)
    fill_in('password-login', with: @admin.password)
    click_on('Log In')
    click_on('Users')
    expect(current_path).to eq(admin_users_path)
  end

  it 'directs to agency admin' do
    fill_in('email-login', with: @admin.email)
    fill_in('password-login', with: @admin.password)
    click_on('Log In')
    click_on('Agencies')
    expect(current_path).to eq(admin_agencies_path)
  end

  it 'directs to network admin' do
    fill_in('email-login', with: @admin.email)
    fill_in('password-login', with: @admin.password)
    click_on('Log In')
    click_on('Networks')
    expect(current_path).to eq(admin_networks_path)
  end

  it 'directs to program admin' do
    fill_in('email-login', with: @admin.email)
    fill_in('password-login', with: @admin.password)
    click_on('Log In')
    click_on('Programs')
    expect(current_path).to eq(admin_programs_path)
  end

  it 'directs to season admin' do
    fill_in('email-login', with: @admin.email)
    fill_in('password-login', with: @admin.password)
    click_on('Log In')
    click_on('Seasons')
    expect(current_path).to eq(admin_seasons_path)
  end

  it 'directs to campaign admin' do
    fill_in('email-login', with: @admin.email)
    fill_in('password-login', with: @admin.password)
    click_on('Log In')
    click_on('Campaigns')
    expect(current_path).to eq(admin_campaigns_path)
  end

  it 'directs to campaign type admin' do
    fill_in('email-login', with: @admin.email)
    fill_in('password-login', with: @admin.password)
    click_on('Log In')
    click_on('Campaign Types')
    expect(current_path).to eq(admin_campaign_types_path)
  end

  it 'directs to buy method admin' do
    fill_in('email-login', with: @admin.email)
    fill_in('password-login', with: @admin.password)
    click_on('Log In')
    click_on('Buy Methods')
    expect(current_path).to eq(admin_buy_methods_path)
  end

  it 'directs to publisher admin' do
    fill_in('email-login', with: @admin.email)
    fill_in('password-login', with: @admin.password)
    click_on('Log In')
    click_on('Publishers')
    expect(current_path).to eq(admin_publishers_path)
  end

  it 'directs to inventory type admin' do
    fill_in('email-login', with: @admin.email)
    fill_in('password-login', with: @admin.password)
    click_on('Log In')
    click_on('Inventory Types')
    expect(current_path).to eq(admin_inventory_types_path)
  end

  it 'directs to tactic admin' do
    fill_in('email-login', with: @admin.email)
    fill_in('password-login', with: @admin.password)
    click_on('Log In')
    click_on('Tactics')
    expect(current_path).to eq(admin_tactics_path)
  end

  it 'directs to device admin' do
    fill_in('email-login', with: @admin.email)
    fill_in('password-login', with: @admin.password)
    click_on('Log In')
    click_on('Devices')
    expect(current_path).to eq(admin_devices_path)
  end

  it 'directs to ad type admin' do
    fill_in('email-login', with: @admin.email)
    fill_in('password-login', with: @admin.password)
    click_on('Log In')
    click_on('Ad Types')
    expect(current_path).to eq(admin_ad_types_path)
  end

  it 'directs to episode admin' do
    fill_in('email-login', with: @admin.email)
    fill_in('password-login', with: @admin.password)
    click_on('Log In')
    click_on('Episodes')
    expect(current_path).to eq(admin_episodes_path)
  end

  it 'directs to targeting type admin' do
    fill_in('email-login', with: @admin.email)
    fill_in('password-login', with: @admin.password)
    click_on('Log In')
    click_on('Targeting Types')
    expect(current_path).to eq(admin_targeting_types_path)
  end
end
