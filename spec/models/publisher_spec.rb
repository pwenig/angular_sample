require 'rails_helper'

RSpec.describe Publisher, type: :model do
  subject { Publisher.new(abbrev: 'Foo') }

  it 'should create a publisher' do
    publisher = Publisher.create!(name: 'ABC', abbrev: 'ABCX')
    expect(publisher.name).to include('ABC')
    expect(publisher.abbrev).to include('ABCX')
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
