require 'rails_helper'

RSpec.describe Campaign, type: :model do
  it 'creates a campaign' do 
    campaign = Campaign.create!(name: 'Foo', abbrev: 'F01')
    expect(campaign.name).to include('Foo')
    expect(campaign.abbrev).to include('F01')
  end
end
