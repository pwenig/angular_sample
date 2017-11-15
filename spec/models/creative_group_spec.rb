require 'rails_helper'

RSpec.describe CreativeGroup, type: :model do
  subject { CreativeGroup.new(abbrev: 'AON') }

  it 'should create a creative group' do
    creative_group = CreativeGroup.create!(name: 'Always On', abbrev: 'AON')
    expect(creative_group.name).to include('Always On')
    expect(creative_group.abbrev).to include('AON')
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
