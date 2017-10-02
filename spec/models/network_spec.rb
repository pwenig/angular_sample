require 'rails_helper'

RSpec.describe Network, type: :model do
  subject { Network.new(abbrev: 'Foo') }

  it 'should have many programs' do 
    should have_many(:programs)
  end 

  it 'creates a network' do
    network = Network.create(name: 'Comedy Central', abbrev: 'CCL')
    expect(network.name).to include('Comedy Central')
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
