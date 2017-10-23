require 'rails_helper'

RSpec.describe CampaignInputsController do
  let!(:user) { FactoryGirl.create(:user) }
  let(:network) {FactoryGirl.create(:network)}
  let(:program) {Program.create!(name: 'Clusterfest', abbrev: 'CLTF', network: network)}
  let(:campaign_type) {FactoryGirl.create(:campaign_type)}
  let(:season) {FactoryGirl.create(:season)}

  before(:each) do
    sign_in(user)
  end

  describe 'GET /campaign_inputs' do
    it 'fetches campaign inputs' do
      get :index
      expect(response.status).to eq(200)
    end

    it 'responds with a 204 if a campaign input tag does not exist' do
      get :show, params: { id: 'CCL_ CLTF_ S00_ BG_ xx_ 20170121-20170221' }
      expect(response.status).to be(204)
    end
  end

  describe 'POST /campaign_inputs' do
    it 'creates a campaign input' do
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
      expect(response.status).to be(201)
    end

    it 'fetches a campaign input if it exists' do
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

  describe 'SHOW /campaign_inputs/:campaign_input_tag' do
    it 'responds with a 200 if a campaign input tag exists' do
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
      get :show, params: { id: 'CCL_ CLTF_ S00_ BG_ xx_ 20170121-20170221' }
      expect(response.status).to be(200)
    end
  end
end
