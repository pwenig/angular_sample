require 'rails_helper'

RSpec.feature 'New Naming Request', type: :feature do
  before do
    visit('/')
    @admin = User.create(email: 'admin@admin.com', password: 'password',
                         admin: true,
                         agency: Agency.create!(name: 'Foo', abbrev: 'foo'))
    @user = FactoryGirl.create(:user)
    FactoryGirl.create(:network)
  end

  it 'sends a new request' do
    fill_in('email-login', with: @user.email)
    fill_in('password-login', with: @user.password)
    click_on('Log In')
    expect(current_path).to eq(root_path)
    click_on('Submit New Requests')
    expect(current_path).to eq(requests_path)
    fill_in('request_name', with: 'foo@foo.com')
    select('Comedy Central', from: 'request_brand')
    select('Ad type', from: 'request_dimension')
    fill_in('request_dimension_value', with: 'New Ad type')
    click_on('Submit')
    expect(page).to have_text('Naming request sent')
  end
end
