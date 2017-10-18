require 'rails_helper'

RSpec.describe PackageInputsController do
  let!(:user) { User.create!(email: 'test@example.com', password: 'testing') }
  before(:each) do
    sign_in(user)
  end

  describe 'GET /package_inputs' do
    it 'fetches package inputs' do
      get :index
      expect(response.status).to eq(200)
    end

    it 'responds with a 204 if a package input tag does not exist' do
      get :show, params: { id: 'CCL_ CLTF_ S00_ BG_ xx_ 20170121-20170221' }
      expect(response.status).to be(204)
    end
  end

  describe 'POST /package_inputs' do
    it 'creates a package input and responds with a 201' do
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
        campaign_input_tag: 'CCL_ CLTF_ S00_ BG_ xx_ 20170121-20170221'
      )
      create_params = {
        campaign_input_id: campaign_input,
        agency_id: Agency.create!(name: 'Sterling Cooper', abbrev: 'sc'),
        publisher_id: Publisher.create!(name: 'ABC', abbrev: 'ABCX'),
        buy_method_id: BuyMethod.create!(name: 'CPA', abbrev: 'CPA'),
        inventory_type_id: InventoryType.create!(name: 'Partner Social Distribution', abbrev: 'PSD'),
        custom: 'xx',
        package_input_tag: 'CCL_CLTF_S00_SC_ABCX_CPA_PSD_xx'
      }
      post :create, params: create_params
      expect(response.status).to be(201)
    end

    it 'responds with a 200 if a package input tag exists' do
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

      # Create the first one
      agency = Agency.create!(name: 'Sterling Cooper', abbrev: 'sc')
      publisher = Publisher.create!(name: 'ABC', abbrev: 'ABCX')
      buy_method = BuyMethod.create!(name: 'CPA', abbrev: 'CPA')
      inventory_type = InventoryType.create!(name: 'Partner Social Distribution', abbrev: 'PSD')
      PackageInput.create!(
        campaign_input: campaign_input,
        agency: agency,
        publisher: publisher,
        buy_method: buy_method,
        inventory_type: inventory_type,
        custom: 'xx',
        package_input_tag: 'CCL_CLTF_S00_SC_ABCX_CPA_PSD_xx'
      )
      # Try and create the second one
      create_params = {
        campaign_input_id: campaign_input,
        agency_id: agency,
        publisher_id: publisher,
        buy_method_id: buy_method,
        inventory_type_id: inventory_type,
        custom: 'xx',
        package_input_tag: 'CCL_CLTF_S00_SC_ABCX_CPA_PSD_xx'
      }
      post :create, params: create_params
      expect(response.status).to be(200)
    end
  end
end
