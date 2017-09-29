require 'rails_helper'

RSpec.describe CampaignType, type: :model do
  subject { CampaignType.new(abbrev: 'Foo') }

  it 'creates a campaign type' do
    campaign_type = CampaignType.create!(name: 'Binge', abbrev: 'BG')
    expect(campaign_type.name).to include('Binge')
    expect(campaign_type.abbrev).to include('BG')
  end

  it 'should validate :abbrev required' do
    should validate_presence_of :abbrev
  end

  it 'should validate :name required' do
    should validate_presence_of :name
  end

  it 'should validate :name uniqueness' do
    should validate_uniqueness_of :name
  end
end
