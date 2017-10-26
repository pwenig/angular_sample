require 'rails_helper'

RSpec.describe Tactic, type: :model do
  subject { Tactic.new(abbrev: 'AUD') }

  it 'should create a tactic' do
    tactic = Tactic.create!(name: 'Audio', abbrev: 'AUD')
    expect(tactic.name).to include('Audio')
    expect(tactic.abbrev).to include('AUD')
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
