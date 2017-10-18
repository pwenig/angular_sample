require 'rails_helper'

RSpec.describe Agency, type: :model do
  subject { Agency.new(abbrev: 'sc') }

  it 'creates an agency' do
    agency = Agency.create!(name: 'Sterling Cooper', abbrev: 'sc')
    expect(agency.name).to include('Sterling Cooper')
    expect(agency.abbrev).to include('sc')
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
