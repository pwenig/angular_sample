require 'rails_helper'

RSpec.describe AdType, type: :model do
  subject { AdType.new(abbrev: 'GIF') }

  it 'should create a new ad type' do
    ad_type = AdType.create!(name: 'Animated Gif', abbrev: 'GIF')
    expect(ad_type.name).to include('Animated Gif')
    expect(ad_type.abbrev).to include('GIF')
  end

  it 'should validate :abbrev required' do
    should validate_presence_of :abbrev
  end

  it 'should validate :name required' do
    should validate_presence_of :name
  end

  it 'should validate :name uniqueness' do
    should validate_presence_of :name
  end
end
