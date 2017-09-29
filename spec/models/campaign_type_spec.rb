require 'rails_helper'

RSpec.describe CampaignType, type: :model do
  it 'creates a campaign type' do 
    campaign_type = CampaignType.create!(name: 'Binge', abbrev: 'BG')
    expect(campaign_type.name).to include('Binge')
    expect(campaign_type.abbrev).to include('BG')
  end 
  
end
