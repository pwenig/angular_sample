require 'rails_helper'

RSpec.describe Episode, type: :model do
  subject { Episode.new(abbrev: 'E01') }

  it 'should create an episode' do 
    episode = Episode.create!(name: 'E01', abbrev: 'E01')
    expect(episode.name).to include('E01')
    expect(episode.abbrev).to include('E01')
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
