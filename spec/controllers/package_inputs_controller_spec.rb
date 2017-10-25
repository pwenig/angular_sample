require 'rails_helper'

RSpec.describe PackageInputsController do
  let!(:user) { FactoryGirl.create(:user) }
  let(:network) { FactoryGirl.create(:network) }
  let(:program) { Program.create!(name: 'Clusterfest', abbrev: 'CLTF', network: network) }
  let(:campaign_type) { FactoryGirl.create(:campaign_type) }
  let(:season) { FactoryGirl.create(:season) }
  let(:agency) { FactoryGirl.create(:agency) }
  let(:publisher) { FactoryGirl.create(:publisher) }
  let(:buy_method) { FactoryGirl.create(:buy_method) }
  let(:inventory_type) { FactoryGirl.create(:inventory_type) }

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
      campaign_input = CampaignInput.create!(
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
      expect(response.status).to be(201)
    end

    it 'responds with a 200 if a package input tag exists' do
      campaign_input = CampaignInput.create!(
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

      # Create the first one
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
