require 'rails_helper'

RSpec.feature 'Campaign Input', type: :feature, js: true do
  before do
    visit('/')
    @user = FactoryGirl.create(:user)
    network = Network.create(name: 'Comedy Central', abbrev: 'CCL')
    Program.create(name: 'Clusterfest', abbrev: 'CLTF', network_id: network.id)
    Season.create!(name: 'S00', abbrev: 's00')
    Season.create!(name: 'S02', abbrev: 's02')
    CampaignType.create!(name: 'Binge', abbrev: 'BG')
    CampaignInput.create!(
      network: network,
      program: Program.create!(name: 'Broad City', abbrev: 'BC', network_id: network.id),
      campaign_type: CampaignType.create!(name: 'Awareness', abbrev: 'AW'),
      season: Season.create!(name: 'S01', abbrev: 's01'),
      custom: 'xx',
      start_month: '01',
      start_day: '21',
      start_year: 2017,
      end_day: '21',
      end_month: '02',
      end_year: 2017,
      campaign_input_tag: 'CCL_BC_S01_AW_xx_20170121-20170221'
    )
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
    click_on('New Campaign String')
    expect(page).to have_select('Network', options: ['Select Network', 'Comedy Central'])
    select('Comedy Central', from: 'Network')
    expect(page).to have_text('Comedy Central')
    expect(page).to have_select('Program', options: ['Select Program', 'Clusterfest', 'Broad City'])
    select('Clusterfest', from: 'Program')
    expect(page).to have_text('Clusterfest')
    expect(page).to have_select('Season', options: ['Select Season', 'S00', 'S01', 'S02'])
    select('S00', from: 'Season')
    expect(page).to have_text('S00')
    expect(page).to have_select('Campaign Type', options: ['Select Campaign Type', 'Binge', 'Awareness'])
    select('Binge', from: 'Campaign Type')
    expect(page).to have_text('Binge')
    expect(page).to have_field('customCampaign')
    fill_in('customCampaign', with: 'XX')
    expect(page).to have_select('Start Month')
    select('01', from: 'Start Month')
    select('01', from: 'Start Day')
    select('02', from: 'End Month')
    select('02', from: 'End Day')
    expect(page).to have_text('Create Campaign String')
    click_on('Create Campaign String')
    expect(page).to have_text('CCL_CLTF_s00_BG_XX_20170101-20170202')
  end

  it 'selects a campaign input tag from the search box' do
    fill_in('email-login', with: @user.email)
    fill_in('password-login', with: @user.password)
    click_on('Log In')
    expect(page).to have_field('Search Campaign Strings')
    fill_in('Search Campaign Strings', with: 'CCL_BC')
    find('.dropdown-menu li a').click
    expect(page).to have_text('CCL_BC_S01_AW_xx_20170121-20170221')
    expect(page).to have_text('Package Input')
  end

  it 'clears a campaign input' do
    fill_in('email-login', with: @user.email)
    fill_in('password-login', with: @user.password)
    click_on('Log In')
    click_on('New Campaign String')
    expect(page).to have_select('Network', options: ['Select Network', 'Comedy Central'])
    select('Comedy Central', from: 'Network')
    expect(page).to have_text('Comedy Central')
    expect(page).to have_select('Program', options: ['Select Program', 'Clusterfest', 'Broad City'])
    select('Clusterfest', from: 'Program')
    expect(page).to have_text('Clusterfest')
    expect(page).to have_select('Season', options: ['Select Season', 'S00', 'S01', 'S02'])
    select('S00', from: 'Season')
    expect(page).to have_text('S00')
    expect(page).to have_select('Campaign Type', options: ['Select Campaign Type', 'Binge', 'Awareness'])
    select('Binge', from: 'Campaign Type')
    expect(page).to have_text('Binge')
    expect(page).to have_field('customCampaign')
    fill_in('customCampaign', with: 'XX')
    expect(page).to have_select('Start Month')
    select('01', from: 'Start Month')
    select('01', from: 'Start Day')
    select('02', from: 'End Month')
    select('02', from: 'End Day')
    expect(page).to have_text('Clear')
    click_on('Clear')
    expect(page).to_not have_text('CCL_CLTF_s00_BG_XX_20170101-20170202')
  end

  it 'duplicates a campaign input' do
    fill_in('email-login', with: @user.email)
    fill_in('password-login', with: @user.password)
    click_on('Log In')
    click_on('New Campaign String')
    expect(page).to have_select('Network', options: ['Select Network', 'Comedy Central'])
    select('Comedy Central', from: 'Network')
    expect(page).to have_text('Comedy Central')
    expect(page).to have_select('Program', options: ['Select Program', 'Clusterfest', 'Broad City'])
    select('Clusterfest', from: 'Program')
    expect(page).to have_text('Clusterfest')
    expect(page).to have_select('Season', options: ['Select Season', 'S00', 'S01', 'S02'])
    select('S00', from: 'Season')
    expect(page).to have_text('S00')
    expect(page).to have_select('Campaign Type', options: ['Select Campaign Type', 'Binge', 'Awareness'])
    select('Binge', from: 'Campaign Type')
    expect(page).to have_text('Binge')
    expect(page).to have_field('customCampaign')
    fill_in('customCampaign', with: 'XX')
    expect(page).to have_select('Start Month')
    select('01', from: 'Start Month')
    select('01', from: 'Start Day')
    select('02', from: 'End Month')
    select('02', from: 'End Day')
    expect(page).to have_text('Create Campaign String')
    click_on('Create Campaign String')
    expect(page).to have_text('CCL_CLTF_s00_BG_XX_20170101-20170202')
    click_on('duplicateCampaign')
    select('S02', from: 'Season')
    click_on('Create Campaign String')
    expect(page).to have_text('CCL_CLTF_s02_BG_XX_20170101-20170202')
  end
end
