require 'rails_helper'

RSpec.describe CampaignInput, type: :model do
  it 'should belong to a program' do
    should belong_to(:program)
  end

  it 'should belong to a season' do
    should belong_to(:season)
  end

  it 'should belong to a campaign type' do
    should belong_to(:campaign_type)
  end

  it 'should create a campaign input' do
    network = Network.create!(name: 'Comedy Central', abbrev: 'CCL')
    program = Program.create!(name: 'Clusterfest', abbrev: 'CLTF', network_id: network.id)
    campaign_type = CampaignType.create!(name: 'Binge', abbrev: 'BG')
    season = Season.create!(name: 'S00', abbrev: 's00')
    custom = 'Custom text'
    start_month = 1
    start_day = 21
    start_year = 2017
    end_month = 2
    end_day = 21
    end_year = 2017
    campaign_input = CampaignInput.create!(
      program: program,
      campaign_type: campaign_type,
      season: season,
      custom: custom,
      start_month: start_month,
      start_day: start_day,
      start_year: start_year,
      end_day: end_day,
      end_month: end_month,
      end_year: end_year
    )
    expect(campaign_input.program.name).to include('Clusterfest')
    expect(campaign_input.campaign_type.name).to include('Binge')
    expect(campaign_input.season.name).to include('S00')
    expect(campaign_input.start_day).to eq(21)
  end
end
