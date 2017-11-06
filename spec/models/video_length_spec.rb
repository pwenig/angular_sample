require 'rails_helper'

RSpec.describe VideoLength, type: :model do
  subject { VideoLength.new }

  it 'should create a video length' do
    video_length = VideoLength.create!(name: '05s')
    expect(video_length.name).to include('05s')
  end

  it 'should validate :name required' do
    should validate_presence_of :name
  end

  it 'should validate :name uniqueness' do
    should validate_uniqueness_of :name
  end
end
