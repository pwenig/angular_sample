require 'rails_helper'

RSpec.feature 'Campaign Input', type: :feature, js: true do
  before do
    visit('/')
    @user = User.create(email: 'user@user.com', password: 'password')
    network = Network.create(name: 'Comedy Central', abbrev: 'CCL')
    Program.create(name: 'Clusterfest', abbrev: 'CLTF', network_id: network.id)
    Season.create!(name: 'S00', abbrev: 's00')
    CampaignType.create!(name: 'Binge', abbrev: 'BG')
  end

  it 'gets to the Campaign Manager' do
    fill_in('email-login', with: @user.email)
    fill_in('password-login', with: @user.password)
    click_on('Log In')
    expect(page).to have_text('Campaign Input')
  end

  it 'creates a campaign input tag' do
    fill_in('email-login', with: @user.email)
    fill_in('password-login', with: @user.password)
    click_on('Log In')
    expect(page).to have_select('Network', options: ['Select Network', 'Comedy Central'])
    select('Comedy Central', from: 'Network')
    expect(page).to have_text('Comedy Central')
    expect(page).to have_select('Program', options: ['Select Program', 'Clusterfest'])
    select('Clusterfest', from: 'Program')
    expect(page).to have_text('Clusterfest')
    expect(page).to have_select('Season', options: ['Select Season', 'S00'])
    select('S00', from: 'Season')
    expect(page).to have_text('S00')
    expect(page).to have_select('Campaign Type', options: ['Select Campaign Type', 'Binge'])
    select('Binge', from: 'Campaign Type')
    expect(page).to have_text('Binge')
    expect(page).to have_field('custom')
    fill_in('custom', with: 'XX')
    expect(page).to have_select('Start Month')
    select('01', from: 'Start Month')
    select('01', from: 'Start Day')
    select('02', from: 'End Month')
    select('02', from: 'End Day')
    expect(page).to have_text('Create')
    expect(page).to have_text('CCL_CLTF_s00_BG_XX_20170101-20170202')
  end
end
