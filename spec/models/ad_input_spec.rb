require 'rails_helper'

RSpec.describe AdInput, type: :model do

  it 'should create an ad input' do
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

    ad_input = AdInput.create!(
      placement_input: placement_input,
      creative_group: CreativeGroup.create!(name: 'Always On', abbrev: 'AON'),
      custom: 'x',
      ad_input_tag: 'CCL_CLTF_S00_AON_ABC_600x120'
    )

    expect(ad_input.creative_group.name).to include('Always On')
    expect(ad_input.placement_input.width).to eq(600)
    expect(ad_input.placement_input.package_input.campaign_input.network.name).to include('Comedy Central')
    expect(ad_input.placement_input.package_input.publisher.name).to include('ABC')
    expect(ad_input.creative_inputs.length).to eq 0
  end
end
