require 'rails_helper'

RSpec.describe Season, type: :model do
  subject { Season.new(abbrev: 'Foo') }

  it 'should have many campaign inputs' do
    should have_many(:campaign_inputs)
  end

  it 'creates a season' do
    season = Season.create!(name: 'S00', abbrev: 's00')
    expect(season.name).to include('S00')
    expect(season.abbrev).to include('s00')
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
