require 'rails_helper'

RSpec.describe MetadataController do 

  describe 'GET /metadata' do 

    before(:each) do
      network = Network.create(name: 'Comedy Central', abbrev: 'CCL')
      Program.create(name: 'Clusterfest', abbrev: 'CLTF', network_id: network.id)
    end 

    it 'fetches metadata' do 
      get :index
      metadata = JSON.parse(response.body)
      expect(metadata['networks'].length).to_not eq(0)
      expect(metadata['networks'].length).to eq(1)
    end

  end 
  
end 