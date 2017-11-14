require 'rails_helper'

RSpec.describe Device, type: :model do
  subject { Device.new(abbrev: 'OTT') }

  it 'should create a device' do
    device = Device.create!(name: 'Over the Top', abbrev: 'OTT')
    expect(device.name).to include('Over the Top')
    expect(device.abbrev).to include('OTT')
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
