require 'rails_helper'

RSpec.describe Program, type: :model do
  let(:network) { Network.create(name: 'Comedy Central', abbrev: 'CCL') }
  subject { Program.new(abbrev: 'Foo', network: network) }

  it 'should belong to network' do
    # Using shoulda matchers for associations
    should belong_to(:network)
  end

  it 'creates a program' do
    network = Network.create(name: 'Comedy Central', abbrev: 'CCL')
    program = Program.create(name: 'Clusterfest', abbrev: 'CLTF', network_id: network.id)
    expect(program.name).to include('Clusterfest')
    expect(program.network.name).to include('Comedy Central')
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
