require 'rails_helper'

RSpec.describe BuyMethod, type: :model do
  subject { BuyMethod.new(abbrev: 'Foo') }

  it 'should create a buy method' do
    buy_method = BuyMethod.create!(name: 'CPA', abbrev: 'CPA')
    expect(buy_method.name).to include('CPA')
    expect(buy_method.abbrev).to include('CPA')
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
