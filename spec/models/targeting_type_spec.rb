require 'rails_helper'

RSpec.describe TargetingType, type: :model do
  subject { TargetingType.new(abbrev: 'BT') }

  it 'should create a targeting type' do
    targeting_type = TargetingType.create!(name: 'Behavioral', abbrev: 'BT')
    expect(targeting_type.name).to include('Behavioral')
    expect(targeting_type.abbrev).to include('BT')
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
