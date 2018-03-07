require 'rails_helper'

RSpec.feature 'Package Input', type: :feature, js: true do
  before do
    visit('/')
    @user = FactoryGirl.create(:user)
    network = Network.create(name: 'Comedy Central', abbrev: 'CCL')
    Program.create(name: 'Clusterfest', abbrev: 'CLTF', network_id: network.id)
    Season.create!(name: 'S00', abbrev: 'S00')
    CampaignType.create!(name: 'Binge', abbrev: 'BG')
    campaign_input = CampaignInput.create!(
      network: network,
      program: Program.create!(name: 'Broad City', abbrev: 'BC', network_id: network.id),
      campaign_type: CampaignType.create!(name: 'Awareness', abbrev: 'AW'),
      season: Season.create!(name: 'S01', abbrev: 'S01'),
      custom: 'xx',
      start_month: '01',
      start_day: '21',
      start_year: 2017,
      end_day: '21',
      end_month: '02',
      end_year: 2017,
      campaign_input_tag: 'CCL_BC_S01_AW_xx_20170121-20170221'
    )
    agency = @user.agency

    buy_method = BuyMethod.create!(name: 'CPA', abbrev: 'CPA')
    publisher = Publisher.create!(name: 'ABC', abbrev: 'ABCX')
    inventory_type = InventoryType.create!(name: 'Partner Social Distribution', abbrev: 'PSD')
    InventoryType.create!(name: 'Custom Program', abbrev: 'CSP')
    PackageInput.create!(
      campaign_input: campaign_input,
      agency: agency,
      publisher: publisher,
      buy_method: buy_method,
      inventory_type: inventory_type,
      custom: 'xx',
      package_input_tag: 'CCL_BC_S01_SC_ABCX_CPA_PSD_xx'
    )
  end

  it 'creates a campaign input tag and shows the package input section' do
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
    expect(page).to have_select('Season', options: ['Select Season', 'S00', 'S01'])
    select('S00', from: 'Season')
    expect(page).to have_text('S00')
    expect(page).to have_select('Campaign Type', options: ['Select Campaign Type', 'Binge', 'Awareness'])
    select('Binge', from: 'Campaign Type')
    expect(page).to have_text('Binge')
    expect(page).to have_field('customCampaign')
    fill_in('customCampaign', with: 'XX')
    expect(page).to have_text('Create')
    click_on('Create')
    expect(page).to have_text("CCL_CLTF_S00_BG_XX_#{date}")
    expect(page).to have_text('New Package')
  end

  it 'creates a package input' do
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
    expect(page).to have_select('Season', options: ['Select Season', 'S00', 'S01'])
    select('S00', from: 'Season')
    expect(page).to have_text('S00')
    expect(page).to have_select('Campaign Type', options: ['Select Campaign Type', 'Binge', 'Awareness'])
    select('Binge', from: 'Campaign Type')
    expect(page).to have_text('Binge')
    expect(page).to have_field('customCampaign')
    fill_in('customCampaign', with: 'XX')
    expect(page).to have_text('Create')
    click_on('Create')
    expect(page).to have_text("CCL_CLTF_S00_BG_XX_#{date}")
    expect(page).to have_text('New Package')
    click_on('New Package')
    expect(page).to have_select('Publisher', options: ['Select Publisher', 'ABC'])
    select('ABC', from: 'Publisher')
    expect(page).to have_select('Buy Method', options: ['Select Buy Method', 'CPA'])
    select('CPA', from: 'Buy Method')
    expect(page).to have_field('customPackage')
    fill_in('customPackage', with: 'XX')
    expect(page).to have_select('Inventory Type', options: ['Select Inventory Type',
                                                            'Partner Social Distribution',
                                                            'Custom Program'])
    select('Partner Social Distribution', from: 'Inventory Type')
    click_on('Create')
    expect(page).to have_text('CCL_CLTF_S00_SC_ABCX_CPA_PSD_XX')
  end

  it 'edits a package input' do 
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
    expect(page).to have_select('Season', options: ['Select Season', 'S00', 'S01'])
    select('S00', from: 'Season')
    expect(page).to have_text('S00')
    expect(page).to have_select('Campaign Type', options: ['Select Campaign Type', 'Binge', 'Awareness'])
    select('Binge', from: 'Campaign Type')
    expect(page).to have_text('Binge')
    expect(page).to have_field('customCampaign')
    fill_in('customCampaign', with: 'XX')
    expect(page).to have_text('Create')
    click_on('Create')
    expect(page).to have_text("CCL_CLTF_S00_BG_XX_#{date}")
    expect(page).to have_text('New Package')
    click_on('New Package')
    expect(page).to have_select('Publisher', options: ['Select Publisher', 'ABC'])
    select('ABC', from: 'Publisher')
    expect(page).to have_select('Buy Method', options: ['Select Buy Method', 'CPA'])
    select('CPA', from: 'Buy Method')
    expect(page).to have_field('customPackage')
    fill_in('customPackage', with: 'XX')
    expect(page).to have_select('Inventory Type', options: ['Select Inventory Type',
                                                            'Partner Social Distribution',
                                                            'Custom Program'])
    select('Partner Social Distribution', from: 'Inventory Type')
    click_on('Create')
    expect(page).to have_text('CCL_CLTF_S00_SC_ABCX_CPA_PSD_XX')
    click_on('Edit')
    select('Custom Program', from: 'Inventory Type')
    click_on('Update')
    expect(page).to have_text('CCL_CLTF_S00_SC_ABCX_CPA_CSP_XX')
  end 


  it 'clears a package input' do
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
    expect(page).to have_select('Season', options: ['Select Season', 'S00', 'S01'])
    select('S00', from: 'Season')
    expect(page).to have_text('S00')
    expect(page).to have_select('Campaign Type', options: ['Select Campaign Type', 'Binge', 'Awareness'])
    select('Binge', from: 'Campaign Type')
    expect(page).to have_text('Binge')
    expect(page).to have_field('customCampaign')
    fill_in('customCampaign', with: 'XX')
    expect(page).to have_text('Create')
    click_on('Create')
    expect(page).to have_text("CCL_CLTF_S00_BG_XX_#{date}")
    expect(page).to have_text('New Package')
    click_on('New Package')
    expect(page).to have_select('Publisher', options: ['Select Publisher', 'ABC'])
    select('ABC', from: 'Publisher')
    expect(page).to have_select('Buy Method', options: ['Select Buy Method', 'CPA'])
    select('CPA', from: 'Buy Method')
    expect(page).to have_field('customPackage')
    fill_in('customPackage', with: 'XX')
    expect(page).to have_select('Inventory Type', options: ['Select Inventory Type',
                                                            'Partner Social Distribution',
                                                            'Custom Program'])
    select('Partner Social Distribution', from: 'Inventory Type')
    expect(page).to have_text('Cancel')
    click_on('Cancel')
    expect(page).to_not have_text('CCL_CLTF_S00_SC_ABCX_CPA_PSD_XX')
  end

  it 'copies a package input' do
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
    expect(page).to have_select('Season', options: ['Select Season', 'S00', 'S01'])
    select('S00', from: 'Season')
    expect(page).to have_text('S00')
    expect(page).to have_select('Campaign Type', options: ['Select Campaign Type', 'Binge', 'Awareness'])
    select('Binge', from: 'Campaign Type')
    expect(page).to have_text('Binge')
    expect(page).to have_field('customCampaign')
    fill_in('customCampaign', with: 'XX')
    expect(page).to have_text('Create')
    click_on('Create')
    expect(page).to have_text("CCL_CLTF_S00_BG_XX_#{date}")
    expect(page).to have_text('New Package')
    click_on('New Package')
    expect(page).to have_select('Publisher', options: ['Select Publisher', 'ABC'])
    select('ABC', from: 'Publisher')
    expect(page).to have_select('Buy Method', options: ['Select Buy Method', 'CPA'])
    select('CPA', from: 'Buy Method')
    expect(page).to have_field('customPackage')
    fill_in('customPackage', with: 'XX')
    expect(page).to have_select('Inventory Type', options: ['Select Inventory Type',
                                                            'Partner Social Distribution',
                                                            'Custom Program'])
    select('Partner Social Distribution', from: 'Inventory Type')
    click_on('Create')
    expect(page).to have_text('CCL_CLTF_S00_SC_ABCX_CPA_PSD_XX')
    click_on('Copy/Create')
    select('Custom Program', from: 'Inventory Type')
    click_on('Create')
    expect(page).to have_text('CCL_CLTF_S00_SC_ABCX_CPA_CSP_XX')
  end

  it 'deletes a package input' do 
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
    expect(page).to have_select('Season', options: ['Select Season', 'S00', 'S01'])
    select('S00', from: 'Season')
    expect(page).to have_text('S00')
    expect(page).to have_select('Campaign Type', options: ['Select Campaign Type', 'Binge', 'Awareness'])
    select('Binge', from: 'Campaign Type')
    expect(page).to have_text('Binge')
    expect(page).to have_field('customCampaign')
    fill_in('customCampaign', with: 'XX')
    expect(page).to have_text('Create')
    click_on('Create')
    expect(page).to have_text("CCL_CLTF_S00_BG_XX_#{date}")
    expect(page).to have_text('New Package')
    click_on('New Package')
    expect(page).to have_select('Publisher', options: ['Select Publisher', 'ABC'])
    select('ABC', from: 'Publisher')
    expect(page).to have_select('Buy Method', options: ['Select Buy Method', 'CPA'])
    select('CPA', from: 'Buy Method')
    expect(page).to have_field('customPackage')
    fill_in('customPackage', with: 'XX')
    expect(page).to have_select('Inventory Type', options: ['Select Inventory Type',
                                                            'Partner Social Distribution',
                                                            'Custom Program'])
    select('Partner Social Distribution', from: 'Inventory Type')
    click_on('Create')
    expect(page).to have_text('CCL_CLTF_S00_SC_ABCX_CPA_PSD_XX')
    click_on('Delete')
    click_on('Yes')
    expect(page).to_not have_text('CCL_CLTF_S00_SC_ABCX_CPA_PSD_XX')
  end 
  
end
