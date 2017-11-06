require 'rails_helper'

RSpec.describe AbtestLabel, type: :model do
  subject { AbtestLabel.new(abbrev: 'CP') }

  it 'should create a AB Test label' do
    ab_label = AbtestLabel.create!(name: 'Copy', abbrev: 'CP')
    expect(ab_label.name).to include('Copy')
    expect(ab_label.abbrev).to include('CP')
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
