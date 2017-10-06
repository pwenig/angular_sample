require 'rails_helper'

RSpec.describe CampaignInputsController do
  describe 'GET /campaign_inputs' do
    let!(:user) { User.create!(email: 'test@example.com', password: 'testing') }
    before(:each) do
      sign_in(user)
    end

    it 'fetches campaign inputs' do
      get :index
      expect(response.status).to eq(200)
    end

    it 'creates a campaign input' do
      network = Network.create!(name: 'Comedy Central', abbrev: 'CCL')
      create_params = {
        network_id: network,
        program_id: Program.create!(name: 'Clusterfest', abbrev: 'CLTF', network: network),
        campaign_type_id: CampaignType.create!(name: 'Binge', abbrev: 'BG'),
        season_id: Season.create!(name: 'S00', abbrev: 's00'),
        custom: 'xx',
        start_month: 1,
        start_day: 21,
        start_year: 2017,
        end_month: 2,
        end_day: 21,
        end_year: 2017,
        campaign_input_tag: 'CCL_ CLTF_ S00_ BG_ xx_ 20170121-20170221'
      }
      post :create, params: create_params
      expect(response.status).to be(201)
    end

    it 'fetches a campaign input if it exists' do
      network = Network.create!(name: 'Comedy Central', abbrev: 'CCL')
      program = Program.create!(name: 'Clusterfest', abbrev: 'CLTF', network: network)
      campaign_type = CampaignType.create!(name: 'Binge', abbrev: 'BG')
      season = Season.create!(name: 'S00', abbrev: 's00')
      # Create the first one
      create_params = {
        network_id: network,
        program_id: program,
        campaign_type_id: campaign_type,
        season_id: season,
        custom: 'xx',
        start_month: 1,
        start_day: 21,
        start_year: 2017,
        end_month: 2,
        end_day: 21,
        end_year: 2017,
        campaign_input_tag: 'CCL_ CLTF_ S00_ BG_ xx_ 20170121-20170221'
      }
      post :create, params: create_params

      # Create the same one
      create_params = {
        network_id: network,
        program_id: program,
        campaign_type_id: campaign_type,
        season_id: season,
        custom: 'xx',
        start_month: 1,
        start_day: 21,
        start_year: 2017,
        end_month: 2,
        end_day: 21,
        end_year: 2017,
        campaign_input_tag: 'CCL_ CLTF_ S00_ BG_ xx_ 20170121-20170221'
      }
      post :create, params: create_params
      expect(response.status).to be(200)
    end
  end
end
