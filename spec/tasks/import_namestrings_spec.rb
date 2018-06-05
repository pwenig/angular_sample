require 'rails_helper'
require 'rake'

RSpec.describe "rake admin:reset_queries" do

  before do    
    network = Network.create(name: 'TestNetwork', abbrev: 'TN')
    Agency.create(name: 'ATestAgency', abbrev: 'ABC')
    Program.create(name: 'TestProgram', abbrev: 'TPRO', network_id: network.id)
    Season.create!(name: 'S00', abbrev: 'S00')
    CampaignType.create!(name: 'TestCampaign', abbrev: 'TC')
    BuyMethod.create!(name: 'TestBuyMethod', abbrev: 'TB')
    Publisher.create!(name: 'TestPublisher', abbrev: 'TP')
    InventoryType.create!(name: 'TestInventoryType', abbrev: 'TT')
    Tactic.create!(name: 'TestTactic', abbrev: 'TTA')
    Device.create!(name: 'TestDevice', abbrev: 'TD')
    AdType.create!(name: 'TestAdType', abbrev: 'TAT')
    TargetingType.create!(name: 'TestTargetingType', abbrev: 'TTT')
    TargetingType.create!(name: 'None', abbrev: 'NO')
    Episode.create!(name: 'E01', abbrev: 'E01')
    Episode.create!(name: 'E02', abbrev: 'E02')
    CreativeGroup.create!(name: 'TestCreativeGroup', abbrev: 'TCG')
    CreativeMessage.create!(name: 'TestCreativeMessage', abbrev: 'TCM')
    AbtestLabel.create!(name: 'TestAbTestLabel', abbrev: 'TAB')
    VideoLength.create!(name: '05s')
  end

  it "should import namestrings" do
    Rails.application.load_tasks 
    Rake::Task["import:namestrings"].reenable
    Rake.application.invoke_task "import:namestrings[test_import]"
    campaign = CampaignInput.take
    expect(campaign.campaign_input_tag).to eq 'TN_TPRO_S00_TC_X_20170626-20171005'
    package = PackageInput.take
    expect(package.package_input_tag).to eq 'TN_TPRO_S00_ABC_TP_TB_TT_X'
    placement = PlacementInput.take
    expect(placement.placement_input_tag).to eq 'TN_TPRO_S00_E01-E01_ABC_TTA_TD_TP_TB_TAT_TT_TTT_NO_NO_NO_X_x_20170626-20171005'
    ad = AdInput.take
    expect(ad.ad_input_tag).to eq 'TN_TPRO_S00_TCG_TP_x_TestAdCustom'
    creative = CreativeInput.take
    expect(creative.creative_input_tag).to eq 'TN_TPRO_S00_TCG_TCM_TestCreativeTheme_01_TAB_x_20170829-20170830'
  end

end