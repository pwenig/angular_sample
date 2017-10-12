require 'rails_helper'

RSpec.describe MetadataService do

  before(:each) do
    network = Network.create(name: 'Comedy Central', abbrev: 'CCL')
    Program.create(name: 'Clusterfest', abbrev: 'CLTF', network_id: network.id)
    Season.create!(name: 'S00', abbrev: 's00')
    CampaignType.create!(name: 'Binge', abbrev: 'BG')
    Campaign.create!(name: 'Foo', abbrev: 'F01')
    Agency.create(name: 'Sterling Cooper', abbrev: 'sc')
    BuyMethod.create!(name: 'CPA', abbrev: 'CPA')
    Publisher.create!(name: 'ABC', abbrev: 'ABCX')
  end


  it 'returns the metadata object' do 
    metadata = MetadataService.fetch_data 
    expect(metadata['networks'].length).to eq(1)
    expect(metadata['networks'].first['programs'].length).to eq(1)
    expect(metadata['seasons'].length).to eq(1)
    expect(metadata['campaign_types'].length).to eq(1)
    expect(metadata['campaigns'].length).to eq(1)
    expect(metadata['agencies'].length).to eq(1)
    expect(metadata['buy_methods'].length).to eq(1)
    expect(metadata['publishers'].length).to eq(1)
  end 

  it 'returns model data' do 
    model_data = MetadataService.fetch_table_data(Season)
    expect(model_data.length).to eq(1)
  end 

end
