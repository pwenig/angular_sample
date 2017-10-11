require 'rails_helper'

RSpec.feature 'Admin', type: :feature do
  before do
    visit('/')
    @admin = User.create(email: 'admin@admin.com', password: 'password', admin: true)
    @user = User.create(email: 'user@user.com', password: 'password')
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

  it 'directs to publisher admin' do
    fill_in('email-login', with: @admin.email)
    fill_in('password-login', with: @admin.password)
    click_on('Log In')
    click_on('Publishers')
    expect(current_path).to eq(admin_publishers_path)
  end
end
