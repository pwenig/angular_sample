require 'rails_helper'

RSpec.describe PlacementInput, type: :model do
  it 'should belong to a package input' do
    should belong_to(:package_input)
  end

  it 'should belong to a tactic' do
    should belong_to(:tactic)
  end

  it 'should belong to a device' do
    should belong_to(:device)
  end

  it 'should belong to a ad type' do
    should belong_to(:ad_type)
  end

  it 'should belong to a targeting type 1' do
    should belong_to(:targeting_type_1)
  end

  it 'should belong to a targeting type 2' do
    should belong_to(:targeting_type_2)
  end

  it 'should belong to a targeting type 3' do
    should belong_to(:targeting_type_3)
  end

  it 'should belong to a targeting type 4' do
    should belong_to(:targeting_type_4)
  end

  it 'should belong to a episode start' do
    should belong_to(:episode_start)
  end

  it 'should belong to a episode end' do
    should belong_to(:episode_end)
  end

  it 'should create a placement input' do
    # Create the campaign input
    network = Network.create!(name: 'Comedy Central', abbrev: 'CCL')
    campaign_input = CampaignInput.create!(
      network: network,
      program: Program.create!(name: 'Clusterfest', abbrev: 'CLTF', network_id: network.id),
      campaign_type: CampaignType.create!(name: 'Binge', abbrev: 'BG'),
      season: Season.create!(name: 'S00', abbrev: 's00'),
      custom: 'xx',
      start_month: '01',
      start_day: '21',
      start_year: 2017,
      end_day: '21',
      end_month: '02',
      end_year: 2017,
      campaign_input_tag: 'CCL_ CLTF_ S00_ BG_ xx_20170121-20170221'
    )

    package_input = PackageInput.create!(
      campaign_input: campaign_input,
      agency: Agency.create!(name: 'Sterling Cooper', abbrev: 'sc'),
      publisher: Publisher.create!(name: 'ABC', abbrev: 'ABCX'),
      buy_method: BuyMethod.create!(name: 'CPA', abbrev: 'CPA'),
      inventory_type: InventoryType.create!(name: 'Partner Social Distribution', abbrev: 'PSD'),
      custom: 'xx',
      package_input_tag: 'CCL_CLTF_S00_SC_ABCX_CPA_PSD_xx'
    )

    placement_input = PlacementInput.create!(
      package_input: package_input,
      tentpole_details: 'ssdd',
      tactic: Tactic.create!(name: 'Audio', abbrev: 'AUD'),
      device: Device.create!(name: 'Over the Top', abbrev: 'OTT'),
      ad_type: AdType.create!(name: 'Animated Gif', abbrev: 'GIF'),
      audience_type: 'XO',
      width: 600,
      height: 120,
      targeting_type_1: TargetingType.create!(name: 'Behavioral', abbrev: 'BT'),
      targeting_type_2: TargetingType.create!(name: 'Contextual', abbrev: 'CT'),
      targeting_type_3: TargetingType.create!(name: 'Day Parting', abbrev: 'DP'),
      targeting_type_4: TargetingType.create!(name: 'Publisher Data', abbrev: 'PD'),
      episode_start: Episode.create!(name: 'E01', abbrev: 'E01'),
      episode_end: Episode.create!(name: 'E05', abbrev: 'E05'),
      placement_input_tag: 'CCL_CLTF_E01_SC_AUD_OTT_ABCX_CPA_GIF_PSD_BT_XO_'
    )
    expect(placement_input.tactic.name).to include('Audio')
    expect(placement_input.ad_type.name).to include('Animated Gif')
    expect(package_input.placement_inputs.length).to eq(1)
  end
end
