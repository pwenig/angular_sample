require 'rails_helper'

RSpec.describe Season, type: :model do
  it 'creates a season' do 
    season = Season.create!(name: 'S00', abbrev: 's00')
    expect(season.name).to include('S00')
    expect(season.abbrev).to include('s00')
  end
end
