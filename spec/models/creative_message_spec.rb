require 'rails_helper'

RSpec.describe CreativeMessage, type: :model do
  subject { CreativeMessage.new(abbrev: 'CS') }

  it 'should create a creative message' do
    creative_message = CreativeMessage.create!(name: 'Coming Soon', abbrev: 'CS')
    expect(creative_message.name).to include('Coming Soon')
    expect(creative_message.abbrev).to include('CS')
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
