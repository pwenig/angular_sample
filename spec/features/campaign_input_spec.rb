require 'rails_helper'

RSpec.feature 'Campaign Input', type: :feature, js: true do
  before do
    visit('/')
    @user = FactoryGirl.create(:user)
    network = Network.create(name: 'Comedy Central', abbrev: 'CCL')
    Program.create(name: 'Clusterfest', abbrev: 'CLTF', network_id: network.id)
    Program.create!(name: 'Broad City', abbrev: 'BC', network_id: network.id)
    Season.create!(name: 'S00', abbrev: 's00')
    Season.create!(name: 'S01', abbrev: 's01')
    Season.create!(name: 'S02', abbrev: 's02')
    CampaignType.create!(name: 'Binge', abbrev: 'BG')
    CampaignType.create!(name: 'Awareness', abbrev: 'AW')
  end

  it 'gets to the Campaign Manager' do
    fill_in('email-login', with: @user.email)
    fill_in('password-login', with: @user.password)
    click_on('Log In')
    expect(page).to have_text('New Campaign')
  end

  it 'creates a campaign input' do
    date = Time.now.strftime('%Y').to_s + Time.now.strftime('%m').to_s + Time.now.strftime('%d').to_s + '-' + Time.now.strftime('%Y').to_s + Time.now.strftime('%m').to_s + Time.now.strftime('%d').to_s
    fill_in('email-login', with: @user.email)
    fill_in('password-login', with: @user.password)
    click_on('Log In')
    click_on('New Campaign')
    expect(page).to have_select('Network', options: ['Select Network', 'Comedy Central'])
    select('Comedy Central', from: 'Network')
    expect(page).to have_text('Comedy Central')
    expect(page).to have_select('Program', options: ['Select Program', 'Clusterfest', 'Broad City'])
    select('Clusterfest', from: 'Program')
    expect(page).to have_text('Clusterfest')
    expect(page).to have_select('Season', options: ['Select Season', 'S00', 'S01', 'S02'])
    select('S00', from: 'Season')
    expect(page).to have_text('S00')
    expect(page).to have_field('customCampaign')
    fill_in('customCampaign', with: 'XX')
    expect(page).to have_select('Campaign Type', options: ['Select Campaign Type', 'Binge', 'Awareness'])
    select('Binge', from: 'Campaign Type')
    expect(page).to have_text('Binge')
    expect(page).to have_text('Create Campaign')
    click_on('Create Campaign')
    expect(page).to have_text("CCL_CLTF_s00_BG_XX_#{date}")
  end

  it 'edits a campaign input' do
    date = Time.now.strftime('%Y').to_s + Time.now.strftime('%m').to_s + Time.now.strftime('%d').to_s + '-' + Time.now.strftime('%Y').to_s + Time.now.strftime('%m').to_s + Time.now.strftime('%d').to_s
    fill_in('email-login', with: @user.email)
    fill_in('password-login', with: @user.password)
    click_on('Log In')
    click_on('New Campaign')
    expect(page).to have_select('Network', options: ['Select Network', 'Comedy Central'])
    select('Comedy Central', from: 'Network')
    expect(page).to have_text('Comedy Central')
    expect(page).to have_select('Program', options: ['Select Program', 'Clusterfest', 'Broad City'])
    select('Clusterfest', from: 'Program')
    expect(page).to have_text('Clusterfest')
    expect(page).to have_select('Season', options: ['Select Season', 'S00', 'S01', 'S02'])
    select('S00', from: 'Season')
    expect(page).to have_text('S00')
    expect(page).to have_field('customCampaign')
    fill_in('customCampaign', with: 'XX')
    expect(page).to have_select('Campaign Type', options: ['Select Campaign Type', 'Binge', 'Awareness'])
    select('Binge', from: 'Campaign Type')
    expect(page).to have_text('Binge')
    expect(page).to have_text('Create Campaign')
    click_on('Create Campaign')
    expect(page).to have_text("CCL_CLTF_s00_BG_XX_#{date}")
    click_on('Edit')
    fill_in('customCampaign', with: 'QQ')
    select('Broad City', from: 'Program')
    click_on('Update Campaign')
    expect(page).to have_text("CCL_BC_s00_BG_QQ_#{date}")
  end


  it 'selects a campaign input tag from the search box' do
    pending
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
    click_on('New Campaign')
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
    expect(page).to have_field('customCampaign')
    fill_in('customCampaign', with: 'XX')
    expect(page).to have_text('Binge')
    expect(page).to have_text('Cancel Campaign')
    click_on('Cancel Campaign')
    expect(page).to_not have_text('CCL_CLTF_s00_BG_XX_20170101-20170202')
  end

  it 'copies a campaign input' do
    date = Time.now.strftime('%Y').to_s + Time.now.strftime('%m').to_s + Time.now.strftime('%d').to_s + '-' + Time.now.strftime('%Y').to_s + Time.now.strftime('%m').to_s + Time.now.strftime('%d').to_s
    fill_in('email-login', with: @user.email)
    fill_in('password-login', with: @user.password)
    click_on('Log In')
    click_on('New Campaign')
    expect(page).to have_select('Network', options: ['Select Network', 'Comedy Central'])
    select('Comedy Central', from: 'Network')
    expect(page).to have_text('Comedy Central')
    expect(page).to have_select('Program', options: ['Select Program', 'Clusterfest', 'Broad City'])
    select('Clusterfest', from: 'Program')
    expect(page).to have_text('Clusterfest')
    expect(page).to have_select('Season', options: ['Select Season', 'S00', 'S01', 'S02'])
    select('S00', from: 'Season')
    expect(page).to have_text('S00')
    expect(page).to have_field('customCampaign')
    fill_in('customCampaign', with: 'XX')
    expect(page).to have_select('Campaign Type', options: ['Select Campaign Type', 'Binge', 'Awareness'])
    select('Binge', from: 'Campaign Type')
    expect(page).to have_text('Binge')
    expect(page).to have_text('Create Campaign')
    click_on('Create Campaign')
    expect(page).to have_text("CCL_CLTF_s00_BG_XX_#{date}")
    click_on('Copy/Create')
    select('Awareness', from: 'Campaign Type')
    click_on('Create Campaign')
    expect(page).to have_text("CCL_CLTF_s00_AW_XX_#{date}")
  end

  it 'deletes a campaign input' do 
    date = Time.now.strftime('%Y').to_s + Time.now.strftime('%m').to_s + Time.now.strftime('%d').to_s + '-' + Time.now.strftime('%Y').to_s + Time.now.strftime('%m').to_s + Time.now.strftime('%d').to_s
    fill_in('email-login', with: @user.email)
    fill_in('password-login', with: @user.password)
    click_on('Log In')
    click_on('New Campaign')
    expect(page).to have_select('Network', options: ['Select Network', 'Comedy Central'])
    select('Comedy Central', from: 'Network')
    expect(page).to have_text('Comedy Central')
    expect(page).to have_select('Program', options: ['Select Program', 'Clusterfest', 'Broad City'])
    select('Clusterfest', from: 'Program')
    expect(page).to have_text('Clusterfest')
    expect(page).to have_select('Season', options: ['Select Season', 'S00', 'S01', 'S02'])
    select('S00', from: 'Season')
    expect(page).to have_text('S00')
    expect(page).to have_field('customCampaign')
    fill_in('customCampaign', with: 'XX')
    expect(page).to have_select('Campaign Type', options: ['Select Campaign Type', 'Binge', 'Awareness'])
    select('Binge', from: 'Campaign Type')
    expect(page).to have_text('Binge')
    expect(page).to have_text('Create Campaign')
    click_on('Create Campaign')
    expect(page).to have_text("CCL_CLTF_s00_BG_XX_#{date}")
    click_on('Delete')
    click_on('Yes')
    expect(page).to_not have_text("CCL_CLTF_s00_BG_XX_#{date}")
  end 
end
