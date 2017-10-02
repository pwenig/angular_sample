require 'rails_helper'

RSpec.describe MetadataService do 

  it 'gets a list of networks' do
    Network.create(name: 'Comedy Central', abbrev: 'CCL')
    networks = MetadataService.get_networks
    expect(networks.length).to_not eq(0)
    expect(networks.length).to eq(1)
  end 

  it 'gets a list of networks and the network programs' do 
    network = Network.create(name: 'Comedy Central', abbrev: 'CCL')
    program = Program.create(name: 'Clusterfest', abbrev: 'CLTF', network_id: network.id)
    networks = MetadataService.get_networks
    expect(networks.first['programs'].length).to eq(1)
  end

  it 'gets a list of seasons' do 
    Season.create(name: 'S01', abbrev: 's01')
    seasons = MetadataService.get_seasons
    expect(seasons.length).to_not eq(0)
    expect(seasons.length).to eq(1)
  end 

  it 'gets a list of campaigns' do 
    Campaign.create(name: 'First', abbrev: '001')
    campaigns = MetadataService.get_campaigns
    expect(campaigns.length).to_not eq(0)
    expect(campaigns.length).to eq(1)
  end 

  it 'gets a list of campaign types' do 
    CampaignType.create(name: 'App Download', abbrev: 'ad')
    campaign_types = MetadataService.get_campaign_types
    expect(campaign_types.length).to_not eq(0)
    expect(campaign_types.length).to eq(1)
  end 

end

