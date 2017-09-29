require 'rails_helper'

RSpec.describe Campaign, type: :model do
  subject { Campaign.new(abbrev: 'Foo') }

  it 'creates a campaign' do
    campaign = Campaign.create!(name: 'Foo', abbrev: 'F01')
    expect(campaign.name).to include('Foo')
    expect(campaign.abbrev).to include('F01')
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
