require 'rails_helper'

RSpec.describe CampaignInput, type: :model do

  it 'should create a campaign input' do
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
      campaign_input_tag: 'CCL_ CLTF_ S00_ BG_ xx_ 20170121-20170221'
    )
    expect(campaign_input.program.name).to include('Clusterfest')
    expect(campaign_input.campaign_type.name).to include('Binge')
    expect(campaign_input.season.name).to include('S00')
    expect(campaign_input.start_day).to eq('21')
    expect(campaign_input.campaign_input_tag).to eq('CCL_ CLTF_ S00_ BG_ xx_ 20170121-20170221')
    expect(campaign_input.package_inputs.length).to eq 0
  end
end
