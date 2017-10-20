require 'rails_helper'

RSpec.describe MetadataController do
  describe 'GET /metadata' do
    let!(:user) { FactoryGirl.create(:user) }

    before(:each) do
      sign_in(user)
      network = Network.create(name: 'Comedy Central', abbrev: 'CCL')
      Program.create(name: 'Clusterfest', abbrev: 'CLTF', network_id: network.id)
      Season.create!(name: 'S00', abbrev: 's00')
      CampaignType.create!(name: 'Binge', abbrev: 'BG')
      Campaign.create!(name: 'Foo', abbrev: 'F01')
      Agency.create(name: 'Sterling Cooper', abbrev: 'sc')
      BuyMethod.create!(name: 'CPA', abbrev: 'CPA')
      Publisher.create!(name: 'ABC', abbrev: 'ABCX')
      InventoryType.create!(name: 'Partner Social Distribution', abbrev: 'PSD')
    end

    it 'fetches metadata' do
      get :index
      metadata = JSON.parse(response.body)
      expect(metadata['networks'].length).to eq(1)
      expect(metadata['networks'].first['programs'].length).to eq(1)
      expect(metadata['seasons'].length).to eq(1)
      expect(metadata['campaign_types'].length).to eq(1)
      expect(metadata['campaigns'].length).to eq(1)
      expect(metadata['agencies'].length).to eq(1)
      expect(metadata['buy_methods'].length).to eq(1)
      expect(metadata['publishers'].length).to eq(1)
      expect(metadata['inventory_types'].length).to eq(1)
    end
  end
end
