require 'rails_helper'

RSpec.describe MetadataService do
  before(:each) do
    network = Network.create(name: 'Comedy Central', abbrev: 'CCL')
    program = Program.create(name: 'Clusterfest', abbrev: 'CLTF', network_id: network.id)
    season = Season.create!(name: 'S00', abbrev: 's00')
    campaign_type = CampaignType.create!(name: 'Binge', abbrev: 'BG')
    Agency.create(name: 'Sterling Cooper', abbrev: 'sc')
    BuyMethod.create!(name: 'CPA', abbrev: 'CPA')
    Publisher.create!(name: 'ABC', abbrev: 'ABCX')
    InventoryType.create!(name: 'Partner Social Distribution', abbrev: 'PSD')
    AdType.create!(name: 'Animated Gif', abbrev: 'GIF')
    TargetingType.create!(name: 'Behavioral', abbrev: 'BT')
    Tactic.create!(name: 'Audio', abbrev: 'AUD')
    Device.create!(name: 'Over the Top', abbrev: 'OTT')
    Episode.create!(name: 'E01', abbrev: 'E01')
    CreativeGroup.create!(name: 'Always On', abbrev: 'AON')
    CreativeMessage.create!(name: 'Coming Soon', abbrev: 'CS')
    AbtestLabel.create!(name: 'Copy', abbrev: 'CP')
    VideoLength.create!(name: '05s')
    CampaignInput.create!(
      network: network,
      program: program,
      campaign_type: campaign_type,
      season: season,
      custom: 'xx',
      start_month: '01',
      start_day: '21',
      start_year: 2017,
      end_day: '21',
      end_month: '02',
      end_year: 2017,
      campaign_input_tag: 'CCL_ CLTF_ S00_ BG_ xx_ 20170121-20170221'
    )
  end

  it 'returns the metadata object' do
    metadata = MetadataService.fetch_data
    expect(metadata[:networks].length).to eq(1)
    expect(metadata[:networks].first['programs'].length).to eq(1)
    expect(metadata[:seasons].length).to eq(1)
    expect(metadata[:campaign_types].length).to eq(1)
    expect(metadata[:agencies].length).to eq(1)
    expect(metadata[:buy_methods].length).to eq(1)
    expect(metadata[:publishers].length).to eq(1)
    expect(metadata[:inventory_types].length).to eq(1)
    expect(metadata[:ad_types].length).to eq(1)
    expect(metadata[:targeting_types].length).to eq(1)
    expect(metadata[:tactics].length).to eq(1)
    expect(metadata[:devices].length).to eq(1)
    expect(metadata[:episodes].length).to eq(1)
    expect(metadata[:creative_groups].length).to eq(1)
    expect(metadata[:creative_messages].length).to eq(1)
    expect(metadata[:abtest_labels].length).to eq(1)
    expect(metadata[:video_lengths].length).to eq(1)
    expect(metadata[:campaign_tags].length).to eq(1)
  end

  it 'returns model data' do
    model_data = MetadataService.fetch_table_data(Season)
    expect(model_data.length).to eq(1)
  end
end
